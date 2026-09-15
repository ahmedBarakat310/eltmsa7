import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =========================
// GET Product By ID
// =========================
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "رقم المنتج غير صحيح" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "المنتج غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المنتج" },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE Product
// =========================
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "رقم المنتج غير صحيح" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      price,
      xcoinPrice,
      image,
      stock,
    } = body;

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description: description || null,
        price: Number(price),
        xcoinPrice: Number(xcoinPrice),
        image: image || null,
        stock: Number(stock ?? 0),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء تعديل المنتج" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE Product
// =========================
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "رقم المنتج غير صحيح" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المنتج" },
      { status: 500 }
    );
  }
}