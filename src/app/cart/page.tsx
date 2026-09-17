"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  xcoinPrice: number;
  image: string | null;
  stock: number;
};

type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= GET CART =================

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/cart", {
          cache: "no-store",
          credentials: "include",
        });

        const data = await response.json();

        if (cancelled) return;

        if (response.status === 401) {
          setError("يجب تسجيل الدخول أولًا");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error || "حدث خطأ أثناء جلب السلة",
          );
        }

        setCartItems(data.cart?.items || []);
      } catch (error) {
        if (cancelled) return;

        console.error("Get cart error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل السلة",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= UPDATE QUANTITY =================

  async function updateQuantity(
    itemId: number,
    quantity: number,
  ) {
    if (quantity < 1) return;

    // حفظ الحالة القديمة في حالة حدوث خطأ
    const previousItems = cartItems;

    // تحديث فوري للواجهة
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // لو حصل خطأ نرجع البيانات القديمة
        setCartItems(previousItems);

        alert(
          data.error || "حدث خطأ أثناء تحديث الكمية",
        );

        return;
      }

      // نثبت القيمة القادمة من السيرفر
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: data.item.quantity,
              }
            : item,
        ),
      );
    } catch {
      // لو حصل خطأ في الاتصال نرجع الحالة القديمة
      setCartItems(previousItems);

      alert("حدث خطأ أثناء تحديث الكمية");
    }
  }

  // ================= DELETE ITEM =================

  async function deleteItem(itemId: number) {
    // حفظ الحالة القديمة
    const previousItems = cartItems;

    // حذف فوري من الشاشة
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // لو السيرفر رفض الحذف نرجع المنتج
        setCartItems(previousItems);

        alert(
          data.error || "حدث خطأ أثناء حذف المنتج",
        );

        return;
      }
    } catch {
      // لو حصل خطأ في الاتصال نرجع المنتج
      setCartItems(previousItems);

      alert("حدث خطأ أثناء حذف المنتج");
    }
  }

  // ================= CALCULATIONS =================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 500 ? 0 : 50;

  const total = subtotal + shipping;

  const productsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // ================= LOADING =================

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] px-5 py-10 lg:px-8 lg:py-14"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 animate-pulse">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-5 h-10 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-5 w-80 rounded bg-gray-200" />
          </div>

          <div className="grid gap-7 lg:grid-cols-[1fr_380px]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-[26px] bg-gray-100"
                />
              ))}
            </div>

            <div className="h-[450px] animate-pulse rounded-[28px] bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-5"
      >
        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">🔒</div>

          <h1 className="mt-5 text-2xl font-black text-[#174c32]">
            {error}
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            سجل دخولك أولًا عشان تقدر تشوف سلة المشتريات الخاصة بيك.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#174c32] px-6 py-3 text-sm font-black text-white transition hover:bg-[#103b27]"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fffdf7] px-5 py-10 lg:px-8 lg:py-14"
    >
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-400">
            <Link
              href="/"
              className="transition hover:text-[#174c32]"
            >
              الرئيسية
            </Link>

            <span>←</span>

            <span className="text-[#174c32]">
              سلة المشتريات
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d8a84e]/20 bg-[#d8a84e]/10 px-4 py-2 text-xs font-black text-[#765c28]">
                🛒 مشترياتك
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#174c32] md:text-4xl">
                سلة المشتريات
              </h1>

              <p className="mt-2 text-sm leading-7 text-gray-500">
                راجع منتجاتك قبل إتمام الطلب
              </p>
            </div>

            <div className="rounded-2xl border border-[#174c32]/10 bg-white px-5 py-3 shadow-sm">
              <span className="text-xs font-bold text-gray-400">
                عدد المنتجات
              </span>

              <div className="mt-1 text-lg font-black text-[#174c32]">
                {productsCount} منتجات
              </div>
            </div>
          </div>
        </div>

        {/* ================= EMPTY CART ================= */}

        {cartItems.length === 0 ? (
          <div className="rounded-[28px] border border-[#174c32]/10 bg-white p-12 text-center shadow-sm">
            <div className="text-6xl">
              🛒
            </div>

            <h2 className="mt-5 text-2xl font-black text-[#174c32]">
              السلة فاضية
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              لسه مفيش منتجات في سلة المشتريات.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-[#174c32] px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#103b27]"
            >
              ابدأ التسوق
            </Link>
          </div>
        ) : (
          /* ================= CONTENT ================= */

          <div className="grid gap-7 lg:grid-cols-[1fr_380px]">

            {/* ================= CART ITEMS ================= */}

            <section className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="
                    group rounded-[26px]
                    border border-[#174c32]/10
                    bg-white
                    p-4
                    shadow-[0_10px_35px_rgba(23,76,50,0.05)]
                    transition-all duration-300
                    hover:border-[#d8a84e]/30
                    hover:shadow-[0_15px_40px_rgba(23,76,50,0.08)]
                    sm:p-5
                  "
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* Product image */}

                    <div
                      className="
                        relative flex h-28 w-full shrink-0
                        items-center justify-center
                        overflow-hidden rounded-2xl
                        bg-[#f7f4ea]
                        sm:h-28 sm:w-28
                      "
                    >
                      <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#d8a84e]/10" />

                      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#fff4d2] transition-transform duration-300 group-hover:scale-105">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            unoptimized
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-5xl">
                            🐊
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product information */}

                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black text-[#174c32]">
                        {item.product.name}
                      </h2>

                      <p className="mt-1 text-xs font-bold text-gray-400">
                        {item.product.price.toLocaleString("ar-EG")} جنيه للقطعة
                      </p>

                      {/* Stock */}

                      <p className="mt-2 text-[11px] font-bold text-gray-400">
                        المتاح: {item.product.stock} قطعة
                      </p>

                      {/* Mobile price */}

                      <div className="mt-3 flex items-center justify-between sm:hidden">
                        <span className="text-lg font-black text-[#174c32]">
                          {(
                            item.product.price *
                            item.quantity
                          ).toLocaleString("ar-EG")}{" "}
                          <span className="text-xs text-[#8b7650]">
                            جنيه
                          </span>
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteItem(item.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                          title="حذف المنتج"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}

                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-center">
                      <div className="flex items-center rounded-xl border border-[#174c32]/10 bg-[#f7f4ea]/50 p-1">

                        {/* Plus */}

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                            )
                          }
                          disabled={
                            item.quantity >=
                            item.product.stock
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-black text-[#174c32] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          +
                        </button>

                        {/* Quantity */}

                        <span className="flex h-9 min-w-9 items-center justify-center text-sm font-black text-[#174c32]">
                          {item.quantity}
                        </span>

                        {/* Minus */}

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-black text-[#174c32] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          −
                        </button>
                      </div>

                      {/* Desktop price */}

                      <div className="hidden text-left sm:block">
                        <p className="text-lg font-black text-[#174c32]">
                          {(
                            item.product.price *
                            item.quantity
                          ).toLocaleString("ar-EG")}
                        </p>

                        <p className="text-[10px] font-bold text-[#8b7650]">
                          جنيه
                        </p>
                      </div>

                      {/* Delete */}

                      <button
                        type="button"
                        onClick={() =>
                          deleteItem(item.id)
                        }
                        className="
                          hidden h-9 w-9
                          items-center justify-center
                          rounded-xl
                          bg-red-50
                          text-red-500
                          transition
                          hover:bg-red-100
                          sm:flex
                        "
                        title="حذف المنتج"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue shopping */}

              <Link
                href="/"
                className="
                  mt-5 flex w-fit items-center gap-2
                  rounded-xl
                  border border-[#174c32]/10
                  bg-white
                  px-5 py-3
                  text-sm font-black
                  text-[#174c32]
                  shadow-sm
                  transition
                  hover:border-[#d8a84e]/40
                  hover:bg-[#d8a84e]/5
                "
              >
                <span>←</span>
                متابعة التسوق
              </Link>
            </section>

            {/* ================= SUMMARY ================= */}

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div
                className="
                  overflow-hidden rounded-[28px]
                  border border-[#174c32]/10
                  bg-white
                  shadow-[0_15px_45px_rgba(23,76,50,0.08)]
                "
              >

                {/* Summary header */}

                <div className="bg-[#174c32] px-6 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white/60">
                        ملخص الطلب
                      </p>

                      <h2 className="mt-1 text-xl font-black">
                        تفاصيل السلة
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                      🛒
                    </div>
                  </div>
                </div>

                {/* Summary content */}

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-500">
                        المنتجات
                      </span>

                      <span className="font-black text-[#174c32]">
                        {subtotal.toLocaleString("ar-EG")} جنيه
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-500">
                        الشحن
                      </span>

                      {shipping === 0 ? (
                        <span className="font-black text-[#174c32]">
                          مجاني
                        </span>
                      ) : (
                        <span className="font-black text-[#174c32]">
                          {shipping.toLocaleString("ar-EG")} جنيه
                        </span>
                      )}
                    </div>

                    <span className="font-black text-[#174c32]">
                      سوف يتم خصم الشحن اذا كنت من سكان قريه عرب الرمل او اجهور الرمل
                    </span>
                  </div>

                  <div className="my-6 h-px bg-gradient-to-l from-transparent via-[#174c32]/10 to-transparent" />

                  {/* Free shipping message */}

                  {subtotal < 5000 && (
                    <div className="mb-5 rounded-2xl bg-[#d8a84e]/10 p-4">
                      <div className="flex gap-3">
                        <span className="text-lg">
                          🚚
                        </span>

                        <div>
                          <p className="text-xs font-black text-[#765c28]">
                            الشحن مجاني!
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-[#8b7650]">
                            أضف{" "}
                            <span className="font-black">
                              {(5000 - subtotal).toLocaleString(
                                "ar-EG",
                              )}{" "}
                              جنيه
                            </span>{" "}
                            لتحصل على شحن مجاني.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Total */}

                  <div className="rounded-2xl bg-[#f7f4ea] p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-500">
                          الإجمالي النهائي
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#174c32]">
                          {total.toLocaleString("ar-EG")}

                          <span className="mr-1 text-xs font-bold text-[#8b7650]">
                            جنيه
                          </span>
                        </p>
                      </div>

                      <span className="text-xl">
                        💰
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}

                  <Link
                    href="/checkout"
                    className="
                      mt-5 flex w-full
                      items-center justify-center gap-3
                      rounded-2xl
                      bg-[#174c32]
                      px-5 py-4
                      text-sm font-black
                      text-white
                      shadow-lg shadow-[#174c32]/15
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#103b27]
                      hover:shadow-xl
                    "
                  >
                    إتمام الطلب
                    <span>←</span>
                  </Link>

                  {/* Trust */}

                  <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400">
                    <span>🔒</span>
                    <span>بياناتك محمية وآمنة</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}