"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string | null;
  stock: number;
};

type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");

  async function getCart() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/cart", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        setError("يجب تسجيل الدخول أولًا");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء جلب السلة");
      }

      const cartItems = data.cart?.items || [];

      if (cartItems.length === 0) {
        setError("السلة فارغة");
        return;
      }

      setItems(cartItems);
    } catch (error) {
      console.error("Get checkout cart error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحميل السلة",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCart();
  }, []);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 5000 ? 0 : 50;

  const total = subtotal + shipping;

  const productsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (!phone.trim()) {
      setError("من فضلك أدخل رقم الهاتف");
      return;
    }

    if (!address.trim()) {
      setError("من فضلك أدخل العنوان");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: phone.trim(),
          address: address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء إنشاء الطلب");
      }

      window.location.href = `/order-success?orderId=${data.order.id}`;
    } catch (error) {
      console.error("Create order error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء إنشاء الطلب",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] px-4 py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="h-[450px] animate-pulse rounded-[28px] bg-gray-200 lg:col-span-2" />
            <div className="h-[400px] animate-pulse rounded-[28px] bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (error && items.length === 0) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4"
      >
        <div className="w-full max-w-md rounded-[28px] border border-[#174c32]/10 bg-white p-8 text-center shadow-xl">
          <div className="mb-5 text-6xl">🛒</div>

          <h1 className="text-2xl font-black text-[#174c32]">
            {error}
          </h1>

          <p className="mt-3 text-gray-500">
            أضف منتجات إلى السلة قبل إتمام الطلب.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-xl bg-[#174c32] px-7 py-3 font-bold text-white no-underline transition hover:bg-[#103b27]"
          >
            العودة للمنتجات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fffdf7] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-10">
          <Link
            href="/cart"
            className="text-sm font-bold text-[#174c32] no-underline hover:underline"
          >
            ← العودة إلى السلة
          </Link>

          <h1 className="mt-5 text-4xl font-black text-[#174c32]">
            إتمام الطلب
          </h1>

          <p className="mt-2 text-gray-500">
            أدخل بيانات التوصيل لتأكيد طلبك.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Form */}

          <div className="rounded-[28px] border border-[#174c32]/10 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
            <h2 className="mb-7 text-2xl font-black text-[#174c32]">
              بيانات التوصيل
            </h2>

            <div className="space-y-6">
              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-black text-gray-700"
                >
                  رقم الهاتف
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="مثال: 01012345678"
                  className="w-full rounded-2xl border border-gray-200 bg-[#fffdf7] px-5 py-4 text-right outline-none transition focus:border-[#174c32] focus:ring-2 focus:ring-[#174c32]/10"
                />
              </div>

              {/* Address */}

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-black text-gray-700"
                >
                  عنوان التوصيل
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="المحافظة، المدينة، الشارع، رقم المنزل..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-[#fffdf7] px-5 py-4 text-right outline-none transition focus:border-[#174c32] focus:ring-2 focus:ring-[#174c32]/10"
                />
              </div>

              {/* Payment */}

              <div>
                <label className="mb-2 block text-sm font-black text-gray-700">
                  طريقة الدفع
                </label>

                <div className="flex items-center gap-4 rounded-2xl border border-[#174c32]/20 bg-[#f7f3e7] p-5">
                  <span className="text-3xl">💵</span>

                  <div>
                    <p className="font-black text-[#174c32]">
                      الدفع عند الاستلام
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ادفع قيمة الطلب عند استلامه.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}

          <div className="h-fit rounded-[28px] border border-[#174c32]/10 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-black text-[#174c32]">
              ملخص الطلب
            </h2>

            <div className="mb-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b border-black/5 pb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4d2] text-2xl">
                      {item.product.image || "🍯"}
                    </div>

                    <div>
                      <p className="font-black text-[#174c32]">
                        {item.product.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="whitespace-nowrap font-black text-[#174c32]">
                    {item.product.price * item.quantity} جنيه
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-black/5 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  المنتجات ({productsCount})
                </span>

                <span className="font-bold">
                  {subtotal} جنيه
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  الشحن
                </span>

                <span className="font-bold">
                  {shipping === 0 ? "مجاني" : `${shipping} جنيه`}
                </span>
              </div>

              {shipping === 0 && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-bold text-[#174c32]">
                  🎉 حصلت على شحن مجاني
                </div>
              )}

              <div className="flex items-center justify-between border-t border-black/5 pt-5">
                <span className="text-lg font-black text-gray-700">
                  الإجمالي
                </span>

                <span className="text-3xl font-black text-[#174c32]">
                  {total} جنيه
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-2xl bg-[#174c32] py-4 text-lg font-black text-white transition hover:bg-[#103b27] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "جاري تأكيد الطلب..."
                : "تأكيد الطلب"}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-gray-400">
              بالضغط على تأكيد الطلب، سيتم إنشاء طلبك وبدء تجهيزه.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}