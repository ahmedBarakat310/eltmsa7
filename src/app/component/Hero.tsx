
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#174c32]">

      {/* Background Decorations */}
      <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#d8a84e]/10 blur-3xl" />

      <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-[#d8a84e]/10 blur-3xl" />

      <div className="absolute right-[45%] top-1/2 h-2 w-2 rounded-full bg-[#d8a84e]" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">

        {/* ================= TEXT ================= */}
        <div className="text-center lg:text-right">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d8a84e]/30 bg-[#d8a84e]/10 px-5 py-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#e4bd67]" />

            <span className="text-sm font-bold text-[#f1d58e]">
              عروض خاصة للتجار وأصحاب المطاعم
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl font-black leading-[1.25] tracking-tight text-white sm:text-6xl lg:text-[72px]">

            طعم أصيل
            <br />

            <span className="relative inline-block text-[#e3b65c]">
              وجودة تثق بها
              
              <span className="absolute -bottom-2 right-0 h-1 w-2/3 rounded-full bg-[#e3b65c]/50" />
            </span>

            <br />

            <span className="text-white">
              من التمساح 🐊
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-9 text-white/70 lg:mx-0 lg:text-xl">
            عسل نحل، عسل أسمر، وطحينة سمسم صافي
            <br className="hidden sm:block" />
            منتجات مختارة بعناية لتناسب احتياجاتك.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:justify-start">

            <Link
              href="#products"
              className="group flex items-center justify-center gap-3 rounded-2xl bg-[#e3b65c] px-8 py-4 font-black text-[#174c32] shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#efca78]"
            >
              تصفح منتجاتنا

              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
            </Link>

            <Link
              href="#contact"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-bold text-white backdrop-blur transition duration-300 hover:bg-white/10"
            >
              تواصل معنا
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex items-center justify-center gap-7 lg:justify-start">

            <div>
              <p className="text-2xl font-black text-white">3+</p>
              <p className="mt-1 text-xs font-medium text-white/50">
                منتجات أساسية
              </p>
            </div>

            <div className="h-10 w-px bg-white/15" />

            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="mt-1 text-xs font-medium text-white/50">
                اهتمام بالجودة
              </p>
            </div>

            <div className="h-10 w-px bg-white/15" />

            <div>
              <p className="text-2xl font-black text-white">جملة</p>
              <p className="mt-1 text-xs font-medium text-white/50">
                للمحلات والمطاعم
              </p>
            </div>

          </div>
        </div>

        {/* ================= VISUAL ================= */}
        <div className="relative flex min-h-[470px] items-center justify-center">

          {/* Glow */}
          <div className="absolute h-[350px] w-[350px] rounded-full bg-[#d8a84e]/20 blur-3xl" />

          {/* Main Circle */}
          <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-[#e3b65c]/20 bg-[#e3b65c]/10 shadow-2xl backdrop-blur-sm sm:h-[430px] sm:w-[430px]">

            {/* Inner Circle */}
            <div className="flex h-[290px] w-[290px] items-center justify-center rounded-full bg-[#fff5d9] shadow-2xl sm:h-[350px] sm:w-[350px]">

              <div className="text-center">

                <div className="mb-3 text-8xl drop-shadow-xl">
                  🍯
                </div>

                <p className="text-2xl font-black text-[#174c32]">
                  التمساح
                </p>

                <p className="mt-2 text-sm font-bold text-[#8b7650]">
                  عسل • طحينة • جودة
                </p>

              </div>
            </div>

            {/* Floating Cards */}

            <div className="absolute -right-5 top-16 rounded-2xl bg-white px-5 py-4 shadow-2xl sm:-right-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3cf] text-xl">
                  🍯
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400">
                    منتجنا
                  </p>

                  <p className="text-sm font-black text-[#174c32]">
                    عسل نحل
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 -left-7 rounded-2xl bg-white px-5 py-4 shadow-2xl sm:-left-12">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1e2c3] text-xl">
                  🥄
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400">
                    طبيعي
                  </p>

                  <p className="text-sm font-black text-[#174c32]">
                    سمسم صافي
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#fffdf7] [clip-path:ellipse(60%_100%_at_50%_100%)]" />

    </section>
  );
}

