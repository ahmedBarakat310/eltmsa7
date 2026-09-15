"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  xcoinPrice: number;
  image: string | null;
  stock: number;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Get Product
  // =========================
  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/products/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "لم نتمكن من العثور على المنتج",
          );
        }

        // لو الـ API بيرجع المنتج مباشرة
        setProduct(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء جلب المنتج",
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getProduct();
    }
  }, [id]);

  // =========================
  // Quantity
  // =========================
  function increaseQuantity() {
    if (!product) return;

    setQuantity((current) =>
      Math.min(current + 1, product.stock),
    );
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(current - 1, 1),
    );
  }

  // =========================
  // Add To Cart
  // =========================
  async function handleAddToCart() {
    if (!product || adding || product.stock <= 0) return;

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
          quantity,
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

      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إضافة المنتج",
      );
    } finally {
      setAdding(false);
    }
  }

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] px-4 py-10"
      >
        <div className="mx-auto max-w-6xl animate-pulse">

          <div className="mb-8 h-5 w-32 rounded bg-gray-200" />

          <div className="grid gap-10 lg:grid-cols-2">

            <div className="h-[500px] rounded-[32px] bg-gray-200" />

            <div className="space-y-5">
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/2 rounded bg-gray-200" />
              <div className="h-28 rounded bg-gray-200" />
              <div className="h-16 rounded bg-gray-200" />
              <div className="h-14 rounded bg-gray-200" />
            </div>

          </div>
        </div>
      </main>
    );
  }

  // =========================
  // Error
  // =========================
  if (error || !product) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4"
      >
        <div className="w-full max-w-md rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-xl">

          <div className="mb-4 text-6xl">
            😕
          </div>

          <h1 className="mb-3 text-2xl font-black text-[#174c32]">
            المنتج غير موجود
          </h1>

          <p className="mb-6 text-sm leading-7 text-gray-500">
            {error || "لم نتمكن من العثور على هذا المنتج."}
          </p>

          <Link
            href="/products"
            className="inline-flex rounded-2xl bg-[#174c32] px-6 py-3 font-black text-white no-underline transition hover:bg-[#103b27]"
          >
            العودة للمنتجات
          </Link>

        </div>
      </main>
    );
  }

  const totalPrice = product.price * quantity;
  const totalXCoin = product.xcoinPrice * quantity;

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fffdf7]"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =========================
            Breadcrumb
        ========================= */}
        <div className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-400">

          <Link
            href="/"
            className="text-[#174c32] no-underline hover:underline"
          >
            الرئيسية
          </Link>

          <span>←</span>

          <Link
            href="/products"
            className="text-[#174c32] no-underline hover:underline"
          >
            المنتجات
          </Link>

          <span>←</span>

          <span className="truncate">
            {product.name}
          </span>

        </div>

        {/* =========================
            Product
        ========================= */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">

          {/* =========================
              Image
          ========================= */}
          <div className="relative overflow-hidden rounded-[32px] border border-[#174c32]/10 bg-[#f7f3e7] shadow-sm">

            <div className="flex min-h-[420px] items-center justify-center p-8 sm:min-h-[520px]">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-[480px] w-full object-contain transition duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-full bg-[#fff4d2] text-[120px] shadow-inner">
                  🐊
                </div>
              )}

            </div>

            {/* Quality */}
            <span className="absolute left-5 top-5 rounded-full bg-[#174c32] px-4 py-2 text-xs font-black text-white shadow-lg">
              جودة مميزة
            </span>

            {/* Stock */}
            <span
              className={`absolute right-5 top-5 rounded-full px-4 py-2 text-xs font-black text-white shadow-lg ${
                product.stock > 0
                  ? "bg-[#d8a84e]"
                  : "bg-red-600"
              }`}
            >
              {product.stock > 0
                ? `متوفر ${product.stock}`
                : "غير متوفر"}
            </span>

          </div>

          {/* =========================
              Details
          ========================= */}
          <div className="flex flex-col justify-center">

            {/* Name */}
            <div className="mb-4 flex items-start justify-between gap-4">

              <h1 className="text-3xl font-black leading-tight text-[#174c32] sm:text-4xl">
                {product.name}
              </h1>

              <span className="text-3xl">
                🍯
              </span>

            </div>

            {/* Description */}
            <p className="mb-8 text-base leading-8 text-gray-500">
              {product.description ||
                "منتج مميز من منتجات التمساح، تم اختياره بعناية لنقدم لك أفضل جودة."}
            </p>

            {/* =========================
                Prices
            ========================= */}
            <div className="mb-7 grid gap-4 sm:grid-cols-2">

              {/* EGP */}
              <div className="rounded-2xl border border-[#174c32]/10 bg-white p-5 shadow-sm">

                <p className="mb-2 text-xs font-bold text-gray-400">
                  السعر
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#174c32]">
                    {product.price}
                  </span>

                  <span className="font-bold text-gray-400">
                    جنيه
                  </span>
                </div>

              </div>

              {/* XCoin */}
              <div className="rounded-2xl border border-[#d8a84e]/30 bg-[#fff4d2] p-5">

                <p className="mb-2 text-xs font-bold text-[#174c32]/60">
                  السعر بالـ XCoin
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#174c32]">
                    {product.xcoinPrice}
                  </span>

                  <span className="font-black text-[#174c32]">
                    XCoin
                  </span>
                </div>

              </div>

            </div>

            {/* =========================
                Quantity
            ========================= */}
            {product.stock > 0 && (
              <div className="mb-6">

                <p className="mb-3 text-sm font-black text-[#174c32]">
                  الكمية
                </p>

                <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-[#174c32]/10 bg-white">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-12 w-12 items-center justify-center text-xl font-black text-[#174c32] transition hover:bg-[#f7f3e7] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    −
                  </button>

                  <span className="flex h-12 min-w-14 items-center justify-center border-x border-[#174c32]/10 px-4 text-lg font-black text-[#174c32]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="flex h-12 w-12 items-center justify-center text-xl font-black text-[#174c32] transition hover:bg-[#f7f3e7] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* =========================
                Total
            ========================= */}
            {product.stock > 0 && (
              <div className="mb-6 rounded-2xl bg-[#f7f3e7] p-5">

                <div className="flex items-center justify-between">

                  <span className="font-bold text-gray-500">
                    الإجمالي
                  </span>

                  <div className="text-left">

                    <div className="text-xl font-black text-[#174c32]">
                      {totalPrice} جنيه
                    </div>

                    <div className="text-sm font-bold text-gray-500">
                      {totalXCoin} XCoin
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =========================
                Add To Cart
            ========================= */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || product.stock <= 0}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#174c32] text-base font-black text-white shadow-lg shadow-[#174c32]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#103b27] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {adding ? (
                <>
                  <span>⏳</span>
                  جاري الإضافة...
                </>
              ) : product.stock <= 0 ? (
                <>
                  <span>❌</span>
                  المنتج غير متوفر
                </>
              ) : (
                <>
                  <span className="text-xl">🛒</span>
                  إضافة إلى السلة
                </>
              )}
            </button>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="mt-4 flex h-14 items-center justify-center rounded-2xl border border-[#174c32]/15 bg-white font-black text-[#174c32] no-underline transition duration-300 hover:bg-[#f7f3e7]"
            >
              متابعة التسوق
            </Link>

          </div>
        </div>

        {/* =========================
            Features
        ========================= */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#174c32]/10 bg-white p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">🍯</div>
            <h3 className="font-black text-[#174c32]">
              جودة مميزة
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              منتجات مختارة بعناية
            </p>
          </div>

          <div className="rounded-2xl border border-[#174c32]/10 bg-white p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">📦</div>
            <h3 className="font-black text-[#174c32]">
              تغليف آمن
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              تجهيز المنتج بعناية
            </p>
          </div>

          <div className="rounded-2xl border border-[#174c32]/10 bg-white p-5 text-center shadow-sm">
            <div className="mb-2 text-2xl">🛒</div>
            <h3 className="font-black text-[#174c32]">
              طلب بسهولة
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              أضف المنتج للسلة مباشرة
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}