import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المنتجات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      xcoinPrice,
      image,
      stock,
    } = body;

    if (!name || price === undefined || xcoinPrice === undefined) {
      return NextResponse.json(
        {
          error: "الاسم والسعر وسعر XCoin مطلوبون",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        xcoinPrice: Number(xcoinPrice),
        image: image || null,
        stock: Number(stock ?? 0),
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      {
        error: "حدث خطأ أثناء إضافة المنتج",
      },
      { status: 500 }
    );
  }
}