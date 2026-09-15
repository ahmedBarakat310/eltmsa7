import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "development-secret-change-this",
);

// ================= GET USER ID =================

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = Number(payload.id);

    if (!userId) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

// ================= UPDATE CART ITEM =================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    const { itemId } = await params;
    const id = Number(itemId);

    if (!id) {
      return NextResponse.json(
        { error: "رقم المنتج في السلة غير صحيح" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const quantity = Number(body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "الكمية يجب أن تكون رقمًا صحيحًا أكبر من صفر" },
        { status: 400 },
      );
    }

    // نتأكد إن الـ CartItem تابع للمستخدم الحالي
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "المنتج غير موجود في سلتك" },
        { status: 404 },
      );
    }

    // التأكد من المخزون
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        {
          error: `الكمية المطلوبة أكبر من المخزون المتاح (${cartItem.product.stock})`,
        },
        { status: 400 },
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      message: "تم تحديث الكمية بنجاح",
      item: updatedItem,
    });
  } catch (error) {
    console.error("PUT /api/cart/[itemId] error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الكمية" },
      { status: 500 },
    );
  }
}

// ================= DELETE CART ITEM =================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    const { itemId } = await params;
    const id = Number(itemId);

    if (!id) {
      return NextResponse.json(
        { error: "رقم المنتج في السلة غير صحيح" },
        { status: 400 },
      );
    }

    // نتأكد إن العنصر تابع لسلة المستخدم الحالي
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "المنتج غير موجود في سلتك" },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "تم حذف المنتج من السلة",
    });
  } catch (error) {
    console.error("DELETE /api/cart/[itemId] error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المنتج" },
      { status: 500 },
    );
  }
}