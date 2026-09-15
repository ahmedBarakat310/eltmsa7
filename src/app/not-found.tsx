
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf7] px-6"
    >
      {/* Background decorations */}
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#e3b65c]/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#174c32]/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#174c32] text-4xl shadow-xl shadow-[#174c32]/20">
            🐊
          </div>
        </div>

        {/* 404 */}
        <div className="relative mb-2">
          <h1 className="text-[130px] font-black leading-none tracking-tight text-[#174c32] sm:text-[180px]">
            404
          </h1>

          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] whitespace-nowrap rounded-full bg-[#e3b65c] px-5 py-2 text-sm font-black text-[#174c32] shadow-lg">
            الصفحة ضاعت في الطريق 🐊
          </span>
        </div>

        {/* Text */}
        <h2 className="mt-8 text-2xl font-black text-[#174c32] sm:text-3xl">
          عفوًا، الصفحة غير موجودة!
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-gray-500 sm:text-base">
          يبدو إن الصفحة اللي بتدور عليها مش موجودة أو تم نقلها.
          <br />
          لكن متقلقش... منتجات التمساح لسه مستنياك 🐊
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-2xl bg-[#174c32] px-8 py-4 text-sm font-black text-white shadow-lg shadow-[#174c32]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#103b27]"
          >
            🏠 الرجوع للرئيسية
          </Link>

          <Link
            href="/#products"
            className="rounded-2xl border-2 border-[#174c32]/10 bg-white px-8 py-4 text-sm font-black text-[#174c32] transition duration-300 hover:-translate-y-1 hover:border-[#e3b65c] hover:bg-[#fff9e8]"
          >
            🛒 تصفح منتجاتنا
          </Link>
        </div>

        {/* Bottom brand */}
        <div className="mt-12">
          <p className="text-sm font-black text-[#174c32]">
            التمساح
          </p>
          <p className="mt-1 text-xs text-gray-400">
            جودة • أصالة • ثقة
          </p>
        </div>
      </div>
    </main>
  );
}

