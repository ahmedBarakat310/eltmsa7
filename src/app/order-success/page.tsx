import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";


export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-4 py-12"
        >
          <div className="text-center">
            <div className="text-5xl">⏳</div>
            <p className="mt-4 font-black text-[#174c32]">
              جاري تحميل بيانات الطلب...
            </p>
          </div>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}