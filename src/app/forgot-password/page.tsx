
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
};

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim().replace(/\s|-/g, "");

    // Name
    if (!name) {
      newErrors.name = "الاسم مطلوب";
    } else if (name.length < 2) {
      newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    } else if (name.length > 50) {
      newErrors.name = "الاسم يجب ألا يتجاوز 50 حرفًا";
    }

    // Email
    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "أدخل بريدًا إلكترونيًا صحيحًا";
    }

    // Egyptian Phone
    if (!phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (
      !/^(01[0125]\d{8}|(?:\+?20)?1[0125]\d{8})$/.test(
        phone
      )
    ) {
      newErrors.phone = "أدخل رقم هاتف مصري صحيح";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    console.log("Forgot password request:", {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });

    setSubmitted(true);
  };

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    setSubmitted(false);
  };

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf7] px-4 py-10"
    >
      {/* Background */}
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#e3b65c]/20 blur-3xl" />

      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#174c32]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 no-underline"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174c32] text-3xl shadow-lg shadow-[#174c32]/20">
              🐊
            </div>

            <div className="text-right">
              <h1 className="text-2xl font-black text-[#174c32]">
                التمساح
              </h1>

              <p className="text-xs font-bold text-[#9b7730]">
                جودة • أصالة • ثقة
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-[#174c32]/10 bg-white p-6 shadow-2xl shadow-[#174c32]/10 sm:p-8">

          {!submitted ? (
            <>
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff4d2] text-3xl">
                  🔐
                </div>

                <h2 className="text-2xl font-black text-[#174c32]">
                  نسيت كلمة المرور؟
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  أدخل بيانات حسابك للتأكد من هويتك
                  والبدء في استرجاع كلمة المرور.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-black text-[#174c32]"
                  >
                    الاسم
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="أدخل الاسم المسجل بالحساب"
                    autoComplete="name"
                    className={`w-full rounded-2xl border bg-[#fffdf7] px-4 py-3.5 text-sm text-gray-800 outline-none transition ${
                      errors.name
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#174c32] focus:ring-4 focus:ring-[#174c32]/10"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-black text-[#174c32]"
                  >
                    البريد الإلكتروني
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="example@email.com"
                    autoComplete="email"
                    dir="ltr"
                    className={`w-full rounded-2xl border bg-[#fffdf7] px-4 py-3.5 text-sm text-gray-800 outline-none transition ${
                      errors.email
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#174c32] focus:ring-4 focus:ring-[#174c32]/10"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-black text-[#174c32]"
                  >
                    رقم الهاتف
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="01012345678"
                    autoComplete="tel"
                    dir="ltr"
                    className={`w-full rounded-2xl border bg-[#fffdf7] px-4 py-3.5 text-sm text-gray-800 outline-none transition ${
                      errors.phone
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#174c32] focus:ring-4 focus:ring-[#174c32]/10"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#174c32] py-4 text-sm font-black text-white shadow-lg shadow-[#174c32]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#103b27] active:translate-y-0"
                >
                  إرسال طلب استرجاع كلمة المرور
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <div className="py-8 text-center">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f7ef] text-4xl">
                ✅
              </div>

              <h2 className="text-2xl font-black text-[#174c32]">
                تم إرسال الطلب
              </h2>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-gray-500">
                تم استلام بياناتك بنجاح.
                <br />
                سيتم التحقق من البيانات والبدء في
                إجراءات استرجاع الحساب.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                  });
                }}
                className="mt-7 rounded-2xl border border-[#174c32]/10 bg-[#fffdf7] px-6 py-3 text-sm font-black text-[#174c32] transition hover:bg-[#f7f4ea]"
              >
                إرسال طلب آخر
              </button>
            </div>
          )}

          {/* Login */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              تذكرت كلمة المرور؟
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-black text-[#174c32] no-underline transition hover:text-[#d09f3d]"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-gray-400 no-underline transition hover:text-[#174c32]"
          >
            ← العودة للرئيسية
          </Link>
        </div>

      </div>
    </main>
  );
}

