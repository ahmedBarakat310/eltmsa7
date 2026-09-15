
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!,
);

async function getAdminId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const userId = Number(payload.id);

    if (!userId || !Number.isInteger(userId)) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return null;
    }

    return user.id;
  } catch {
    return null;
  }
}

/* =========================
   GET ALL ORDERS
========================= */

export async function GET() {
  try {
    const adminId = await getAdminId();

    if (!adminId) {
      return NextResponse.json(
        {
          error: "غير مصرح لك بالوصول",
        },
        {
          status: 403,
        },
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

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
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء جلب الطلبات",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================
   UPDATE ORDER STATUS
========================= */

export async function PATCH(request: Request) {
  try {
    const adminId = await getAdminId();

    if (!adminId) {
      return NextResponse.json(
        {
          error: "غير مصرح لك بالوصول",
        },
        {
          status: 403,
        },
      );
    }

    const body = await request.json();

    const orderId = Number(body.orderId);
    const status = body.status;

    /* =========================
       VALIDATE ORDER ID
    ========================= */

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        {
          error: "رقم الطلب غير صحيح",
        },
        {
          status: 400,
        },
      );
    }

    /* =========================
       VALIDATE STATUS
    ========================= */

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "حالة الطلب غير صحيحة",
        },
        {
          status: 400,
        },
      );
    }

    /* =========================
       CHECK ORDER
    ========================= */

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "الطلب غير موجود",
        },
        {
          status: 404,
        },
      );
    }

    /* =========================
       UPDATE
    ========================= */

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },

        items: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      order,
    });
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء تحديث الطلب",
      },
      {
        status: 500,
      },
    );
  }
}

