import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "development-secret-change-this",
);

// ================= GET CART =================

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = Number(payload.id);

    if (!userId) {
      return NextResponse.json(
        { error: "بيانات المستخدم غير صحيحة" },
        { status: 401 },
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        cart: null,
        items: [],
      });
    }

    return NextResponse.json({
      cart: {
        id: cart.id,
        userId: cart.userId,
        items: cart.items,
      },
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب السلة" },
      { status: 500 },
    );
  }
}

// ================= ADD TO CART =================

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = Number(payload.id);

    if (!userId) {
      return NextResponse.json(
        { error: "بيانات المستخدم غير صحيحة" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const productId = Number(body.productId);
    const quantity = Number(body.quantity ?? 1);

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: "بيانات المنتج أو الكمية غير صحيحة" },
        { status: 400 },
      );
    }

    // ================= CHECK PRODUCT =================

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "المنتج غير موجود" },
        { status: 404 },
      );
    }

    // ================= CHECK STOCK =================

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "الكمية المطلوبة غير متوفرة في المخزون" },
        { status: 400 },
      );
    }

    // ================= GET OR CREATE CART =================

    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    // ================= CHECK EXISTING ITEM =================

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: "الكمية المطلوبة أكبر من المخزون المتاح" },
          { status: 400 },
        );
      }

      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      });

      return NextResponse.json({
        message: "تم تحديث الكمية في السلة",
        item: updatedItem,
      });
    }

    // ================= CREATE CART ITEM =================

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      {
        message: "تمت إضافة المنتج للسلة",
        item: cartItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/cart error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة المنتج للسلة" },
      { status: 500 },
    );
  }
}