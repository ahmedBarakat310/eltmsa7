"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  xcoinPrice: number;
  image: string | null;
  stock: number;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [adding, setAdding] = useState(false);

  async function handleAddToCart() {
    if (adding) return;

    setAdding(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        alert("يجب تسجيل الدخول أولًا");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "حدث خطأ أثناء إضافة المنتج",
        );
      }

      alert("تمت إضافة المنتج إلى السلة 🛒");

      // تحديث عداد السلة في الـ Navbar
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إضافة المنتج",
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#174c32]/10 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#174c32]/10">

      {/* =========================
          Product Image
      ========================= */}
      <Link
        href={`/products/${product.id}`}
        className="relative block overflow-hidden bg-[#f7f3e7]"
      >
        <div className="relative flex h-[300px] items-center justify-center overflow-hidden">

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-contain p-6 transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-[#fff4d2] text-8xl shadow-inner">
              🐊
            </div>
          )}

          {/* Quality Badge */}
          <span className="absolute left-4 top-4 rounded-full bg-[#174c32] px-3 py-1.5 text-[11px] font-black text-white shadow-md">
            جودة مميزة
          </span>

          {/* Out Of Stock */}
          {product.stock <= 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-black text-white shadow-md">
              غير متوفر
            </span>
          )}
        </div>
      </Link>

      {/* =========================
          Product Content
      ========================= */}
      <div className="p-6">

        {/* Product Name */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-xl font-black text-[#174c32]">
            {product.name}
          </h3>

          <span className="mt-1 text-lg">
            🍯
          </span>
        </div>

        {/* Description */}
        <p className="min-h-[52px] text-sm leading-7 text-gray-500">
          {product.description ||
            "منتج مميز من منتجات التمساح"}
        </p>

        {/* =========================
            Prices
        ========================= */}
        <div className="mt-5 flex items-end justify-between border-t border-black/5 pt-5">

          <div className="space-y-2">

            {/* Regular Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#174c32]">
                {product.price}
              </span>

              <span className="text-sm font-bold text-gray-400">
                جنيه
              </span>
            </div>

            {/* XCoin Price */}
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#fff4d2] px-2.5 py-1 text-sm font-black text-[#174c32]">
                {product.xcoinPrice} XCoin
              </span>

              <span className="text-xs font-bold text-gray-400">
                سعر XCoin
              </span>
            </div>

          </div>

          {/* =========================
              Add To Cart
          ========================= */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#174c32] text-lg text-white transition duration-300 hover:scale-105 hover:bg-[#103b27] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`إضافة ${product.name} إلى السلة`}
          >
            {adding
              ? "⏳"
              : product.stock <= 0
                ? "❌"
                : "🛒"}
          </button>

        </div>

      </div>
    </article>
  );
}