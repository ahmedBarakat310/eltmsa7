import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "development-secret-change-this",
);

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

export async function POST(request: Request) {
  try {
    // ================= GET USER =================

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    // ================= GET BODY =================

    const body = await request.json();

    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();

    if (!phone || !address) {
      return NextResponse.json(
        { error: "رقم الهاتف والعنوان مطلوبان" },
        { status: 400 },
      );
    }

    // ================= GET CART =================

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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "السلة فارغة" },
        { status: 400 },
      );
    }

    // ================= CHECK STOCK =================

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            error: `الكمية المطلوبة من "${item.product.name}" غير متوفرة`,
          },
          { status: 400 },
        );
      }
    }

    // ================= CALCULATE TOTAL =================

    const subtotal = cart.items.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0,
    );

    const shipping = subtotal >= 500 ? 0 : 50;

    const total = subtotal + shipping;

    // ================= CREATE ORDER =================

    const order = await prisma.$transaction(async (tx) => {
      // إنشاء الطلب
      const newOrder = await tx.order.create({
        data: {
          userId,
          subtotal,
          shipping,
          total,
          phone,
          address,
          status: "PENDING",

          items: {
            create: cart.items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },

        include: {
          items: true,
        },
      });

      // ================= DECREASE STOCK =================

      for (const item of cart.items) {
        await tx.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // ================= CLEAR CART =================

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      {
        message: "تم إنشاء الطلب بنجاح",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء إنشاء الطلب",
      },
      { status: 500 },
    );
  }
}
export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولًا" },
        { status: 401 },
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: {
          orderBy: {
            id: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء جلب الطلبات",
      },
      { status: 500 },
    );
  }
}