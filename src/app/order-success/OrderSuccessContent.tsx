"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4 py-12"
    >
      <div className="w-full max-w-xl rounded-[32px] border border-[#174c32]/10 bg-white p-8 text-center shadow-xl sm:p-12">
        {/* Success Icon */}

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#174c32]/10 text-5xl">
          🎉
        </div>

        {/* Title */}

        <h1 className="mt-7 text-3xl font-black text-[#174c32] sm:text-4xl">
          تم استلام طلبك بنجاح
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-8 text-gray-500">
          شكرًا لطلبك من التمساح ❤️
          <br />
          سيتم التواصل معك لتأكيد الطلب وتجهيزه.
        </p>

        {/* Order Number */}

        {orderId && (
          <div className="mt-8 rounded-2xl bg-[#f7f3e7] px-6 py-5">
            <p className="text-sm font-bold text-gray-500">
              رقم الطلب
            </p>

            <p className="mt-1 text-3xl font-black text-[#174c32]">
              #{orderId}
            </p>
          </div>
        )}

        {/* Buttons */}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="flex items-center justify-center rounded-2xl bg-[#174c32] px-5 py-4 text-sm font-black text-white no-underline shadow-lg shadow-[#174c32]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#103b27] hover:shadow-xl"
          >
            العودة للرئيسية
          </Link>

          <Link
            href="/#products"
            className="flex items-center justify-center rounded-2xl border border-[#174c32]/15 bg-white px-5 py-4 text-sm font-black text-[#174c32] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f7f3e7]"
          >
            تصفح المنتجات
          </Link>
        </div>
      </div>
    </main>
  );
}