"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  phone: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
};

const statusMap: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "في انتظار التأكيد",
    className: "bg-yellow-50 text-yellow-700",
  },
  CONFIRMED: {
    label: "تم تأكيد الطلب",
    className: "bg-blue-50 text-blue-700",
  },
  PROCESSING: {
    label: "جاري التجهيز",
    className: "bg-purple-50 text-purple-700",
  },
  SHIPPED: {
    label: "تم الشحن",
    className: "bg-indigo-50 text-indigo-700",
  },
  DELIVERED: {
    label: "تم التسليم",
    className: "bg-green-50 text-green-700",
  },
  CANCELLED: {
    label: "تم إلغاء الطلب",
    className: "bg-red-50 text-red-700",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function getOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        cache: "no-store",
        credentials: "include",
      });

      const data = await response.json();

      if (response.status === 401) {
        setError("يجب تسجيل الدخول أولًا");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "حدث خطأ أثناء جلب الطلبات");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Get orders error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحميل الطلبات",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#fffdf7] px-4 py-12"
      >
        <div className="mx-auto max-w-5xl">
          <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-[28px] bg-gray-200"
              />
            ))}
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
        className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4"
      >
        <div className="w-full max-w-md rounded-[28px] border border-[#174c32]/10 bg-white p-8 text-center shadow-xl">
          <div className="mb-5 text-6xl">🔐</div>

          <h1 className="text-2xl font-black text-[#174c32]">
            {error}
          </h1>

          <p className="mt-3 text-gray-500">
            سجل الدخول عشان تقدر تشوف طلباتك.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex rounded-xl bg-[#174c32] px-7 py-3 font-bold text-white no-underline transition hover:bg-[#103b27]"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>
    );
  }

  // ================= EMPTY =================

  if (orders.length === 0) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4"
      >
        <div className="w-full max-w-md rounded-[28px] border border-[#174c32]/10 bg-white p-8 text-center shadow-xl">
          <div className="mb-5 text-6xl">📦</div>

          <h1 className="text-2xl font-black text-[#174c32]">
            لا توجد طلبات حتى الآن
          </h1>

          <p className="mt-3 text-gray-500">
            لما تعمل أول طلب، هتقدر تتابع حالته من هنا.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-xl bg-[#174c32] px-7 py-3 font-bold text-white no-underline transition hover:bg-[#103b27]"
          >
            تصفح المنتجات
          </Link>
        </div>
      </main>
    );
  }

  // ================= ORDERS =================

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#fffdf7] px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#174c32]">
            طلباتي
          </h1>

          <p className="mt-2 text-gray-500">
            تابع طلباتك وحالتها من مكان واحد.
          </p>
        </div>

        {/* Orders */}

        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusMap[order.status] || {
              label: order.status,
              className: "bg-gray-100 text-gray-600",
            };

            const orderDate = new Date(
              order.createdAt,
            ).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-[28px] border border-[#174c32]/10 bg-white shadow-sm transition duration-300 hover:shadow-xl"
              >
                {/* Order Header */}

                <div className="flex flex-col gap-4 border-b border-black/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-400">
                      رقم الطلب
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-[#174c32]">
                      #{order.id}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-black ${status.className}`}
                    >
                      {status.label}
                    </span>

                    <span className="text-sm font-bold text-gray-400">
                      {orderDate}
                    </span>
                  </div>
                </div>

                {/* Products */}

                <div className="space-y-4 p-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-2xl bg-[#f7f3e7] p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4d2] text-2xl">
                          🍯
                        </div>

                        <div>
                          <h3 className="font-black text-[#174c32]">
                            {item.productName}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            الكمية: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <p className="font-black text-[#174c32]">
                          {item.price * item.quantity} جنيه
                        </p>

                        <p className="text-xs text-gray-400">
                          {item.price} جنيه × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}

                <div className="border-t border-black/5 bg-[#fffdf7] p-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        الإجمالي قبل الشحن
                      </p>

                      <p className="mt-1 font-black text-[#174c32]">
                        {order.subtotal} جنيه
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        الشحن
                      </p>

                      <p className="mt-1 font-black text-[#174c32]">
                        {order.shipping === 0
                          ? "مجاني"
                          : `${order.shipping} جنيه`}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        الإجمالي
                      </p>

                      <p className="mt-1 text-xl font-black text-[#174c32]">
                        {order.total} جنيه
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-black/5 pt-5">
                    <p className="text-xs font-bold text-gray-400">
                      عنوان التوصيل
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                      {order.address}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                      📞 {order.phone}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}