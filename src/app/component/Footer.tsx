
import Link from "next/link";
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#103b27]">
        <section className="bg-[#fffdf7] px-5 py-24 lg:px-8">
  <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

    {/* Text */}
    <div>

      <div className="mb-5 flex items-center gap-3">
        <span className="h-[2px] w-10 bg-[#d8a84e]" />

        <span className="text-sm font-black text-[#9b7730]">
          تواصل معنا
        </span>
      </div>

      <h2 className="text-4xl font-black leading-[1.4] text-[#174c32] sm:text-5xl">
        خلينا نعرف
        <br />

        <span className="text-[#d09f3d]">
          إنت محتاج إيه؟
        </span>
      </h2>

      <p className="mt-6 max-w-xl text-base leading-9 text-gray-500">
        سواء كنت عميل فردي أو صاحب محل أو تاجر جملة أو
        مطعم، تقدر تتواصل معنا بسهولة وهنساعدك في معرفة
        المنتجات والأسعار والعروض المتاحة.
      </p>

      {/* Contact Info */}
      <div className="mt-8 space-y-4">

        <a
          href="https://wa.me/201278389339"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-4 rounded-2xl border border-[#174c32]/10 bg-white px-5 py-4 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f4eb] text-xl">
            💬
          </span>

          <div>
            <p className="text-xs font-bold text-gray-400">
              واتساب
            </p>

            <p
              dir="ltr"
              className="mt-1 font-black text-[#174c32]"
            >
              +201278389339
            </p>
          </div>
        </a>

      </div>

    </div>

    {/* Form */}
    <ContactForm />

  </div>
</section>

      {/* ================= CONTACT CTA ================= */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

          <div className="relative overflow-hidden rounded-[32px] bg-[#174c32] px-7 py-12 sm:px-12 lg:px-16">

            {/* Decorations */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d8a84e]/10 blur-3xl" />

            <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#d8a84e]/10 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-right">

              <div>

                <span className="inline-block rounded-full bg-[#d8a84e]/15 px-4 py-2 text-xs font-black text-[#f1d58e]">
                  📦 للمحلات والمطاعم والتجار
                </span>

                <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
                  محتاج أسعار الجملة؟
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                  تواصل معنا لمعرفة المنتجات المتاحة وعروض الجملة
                  والتوريد للمحلات والمطاعم.
                </p>

              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

                <a
                  href="tel:+201278389339"
                  className="rounded-xl bg-[#e3b65c] px-7 py-3.5 text-sm font-black text-[#174c32] transition hover:-translate-y-1 hover:bg-[#efca78]"
                >
                  📞 اتصل بنا
                </a>

                <a
                  href="https://wa.me/201278389339"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/10"
                >
                  💬 واتساب
                </a>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3b65c] text-2xl">
                🐊
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  التمساح
                </h3>

                <p className="mt-1 text-[10px] font-bold text-[#d8a84e]">
                  جودة • أصالة • ثقة
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">
              منتجات طبيعية بجودة نهتم بها، نقدم العسل والطحينة
              للأفراد والتجار والمحلات والمطاعم.
            </p>

          </div>

          {/* Links */}
          <div>

            <h4 className="mb-6 font-black text-white">
              روابط سريعة
            </h4>

            <div className="flex flex-col gap-4 text-sm text-white/50">

              <Link
                href="#products"
                className="transition hover:text-[#e3b65c]"
              >
                منتجاتنا
              </Link>

              <Link
                href="#about"
                className="transition hover:text-[#e3b65c]"
              >
                من نحن
              </Link>

              <Link
                href="#contact"
                className="transition hover:text-[#e3b65c]"
              >
                تواصل معنا
              </Link>

              <Link
                href="/login"
                className="transition hover:text-[#e3b65c]"
              >
                تسجيل الدخول
              </Link>

            </div>
          </div>

          {/* Products */}
          <div>

            <h4 className="mb-6 font-black text-white">
              منتجاتنا
            </h4>

            <div className="flex flex-col gap-4 text-sm text-white/50">

              <span>🍯 عسل النحل</span>

              <span>🍯 العسل الأسمر</span>

              <span>🥄 طحينة سمسم صافي</span>

              <span>📦 عروض الجملة</span>

            </div>
          </div>

          {/* Contact */}
          <div>

            <h4 className="mb-6 font-black text-white">
              تواصل معنا
            </h4>

            <div className="flex flex-col gap-5 text-sm text-white/50">

              <a
                href="tel:+201000000000"
                className="flex items-center gap-3 transition hover:text-[#e3b65c]"
              >
                <span>📞</span>
                <span dir="ltr">
                  +20 1278389339
                </span>
              </a>

              <a
                href="mailto:info@altamsah.com"
                className="flex items-center gap-3 transition hover:text-[#e3b65c]"
              >
                <span>✉️</span>
                barakata138@gmail.com
              </a>

              <div className="flex items-center gap-3">
                <span>📍</span>
                مصر
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row">

          <p>
            © {new Date().getFullYear()} التمساح. جميع الحقوق محفوظة.
          </p>

          <p>
            صُنع بكل ❤️ في مصر
          </p>

        </div>

      </div>
    </footer>
  );
}

