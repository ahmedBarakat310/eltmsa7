
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
   PUT - UPDATE USER
========================= */

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "رقم المستخدم غير صحيح",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const phone =
      body.phone === null || body.phone === undefined
        ? null
        : String(body.phone).trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "الاسم مطلوب",
        },
        {
          status: 400,
        },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error: "البريد الإلكتروني مطلوب",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "المستخدم غير موجود",
        },
        {
          status: 404,
        },
      );
    }

    const emailUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailUser && emailUser.id !== userId) {
      return NextResponse.json(
        {
          error: "البريد الإلكتروني مستخدم بالفعل",
        },
        {
          status: 409,
        },
      );
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,
        email,
        phone,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        xcoin: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء تحديث المستخدم",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================
   PATCH - XCOIN
========================= */

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "رقم المستخدم غير صحيح",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const action = body.xcoinAction;
    const amount = Number(body.amount);

    if (action !== "add" && action !== "remove") {
      return NextResponse.json(
        {
          error: "عملية XCoin غير صحيحة",
        },
        {
          status: 400,
        },
      );
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error: "قيمة XCoin غير صحيحة",
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "المستخدم غير موجود",
        },
        {
          status: 404,
        },
      );
    }

    if (action === "remove" && amount > user.xcoin) {
      return NextResponse.json(
        {
          error: "رصيد XCoin غير كافي",
        },
        {
          status: 400,
        },
      );
    }

    const newXcoin =
      action === "add"
        ? user.xcoin + amount
        : user.xcoin - amount;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        xcoin: newXcoin,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        xcoin: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء تعديل XCoin",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================
   DELETE - DELETE USER
========================= */

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "رقم المستخدم غير صحيح",
        },
        {
          status: 400,
        },
      );
    }

    if (userId === adminId) {
      return NextResponse.json(
        {
          error: "لا يمكنك حذف حساب الأدمن الحالي",
        },
        {
          status: 400,
        },
      );
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

    if (!user) {
      return NextResponse.json(
        {
          error: "المستخدم غير موجود",
        },
        {
          status: 404,
        },
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        {
          error: "لا يمكن حذف حساب أدمن",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم حذف المستخدم بنجاح",
    });
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء حذف المستخدم",
      },
      {
        status: 500,
      },
    );
  }
}
