
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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        xcoin: true,
        createdAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      users,
    });
  } catch {
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء جلب المستخدمين",
      },
      {
        status: 500,
      },
    );
  }
}

