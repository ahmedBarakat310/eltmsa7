"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "أدخل بريدًا إلكترونيًا صحيحًا";
    }

    // Phone
    if (!phone) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (
      !/^(01[0125]\d{8}|(?:\+?20)?1[0125]\d{8})$/.test(
        phone.replace(/\s|-/g, "")
      )
    ) {
      newErrors.phone = "أدخل رقم هاتف مصري صحيح";
    }

    // Password
    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (password.length > 64) {
      newErrors.password =
        "كلمة المرور يجب ألا تتجاوز 64 حرفًا";
    } else if (!/[A-Za-z]/.test(password)) {
      newErrors.password =
        "يجب أن تحتوي كلمة المرور على حرف واحد على الأقل";
    } else if (!/\d/.test(password)) {
      newErrors.password =
        "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword =
        "تأكيد كلمة المرور مطلوب";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "كلمتا المرور غير متطابقتين";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general:
            data.error || "حدث خطأ أثناء إنشاء الحساب",
        });

        return;
      }

      // إنشاء الحساب نجح
      window.location.href = "/login";
    } catch (error) {
      console.error("Register error:", error);

      setErrors({
        general:
          "حدث خطأ أثناء الاتصال بالسيرفر، حاول مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
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
        general: undefined,
      }));
    }
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

          <div className="mb-7">
            <h2 className="text-2xl font-black text-[#174c32]">
              إنشاء حساب
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              أنشئ حسابك واستمتع بتجربة أفضل مع التمساح.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >

            {/* General Error */}
            {errors.general && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-600">
                {errors.general}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-black text-[#174c32]">
                الاسم
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
                }
                placeholder="أدخل اسمك"
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
              <label className="mb-2 block text-sm font-black text-[#174c32]">
                البريد الإلكتروني
              </label>

              <input
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
              <label className="mb-2 block text-sm font-black text-[#174c32]">
                رقم الهاتف
              </label>

              <input
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

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-black text-[#174c32]">
                كلمة المرور
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={form.password}
                  onChange={(e) =>
                    updateField(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="8 أحرف على الأقل"
                  autoComplete="new-password"
                  dir="ltr"
                  className={`w-full rounded-2xl border bg-[#fffdf7] px-4 py-3.5 pl-12 text-sm text-gray-800 outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#174c32] focus:ring-4 focus:ring-[#174c32]/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                  aria-label={
                    showPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p className="mt-2 text-xs font-bold text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-black text-[#174c32]">
                تأكيد كلمة المرور
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  placeholder="أعد كتابة كلمة المرور"
                  autoComplete="new-password"
                  dir="ltr"
                  className={`w-full rounded-2xl border bg-[#fffdf7] px-4 py-3.5 pl-12 text-sm text-gray-800 outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#174c32] focus:ring-4 focus:ring-[#174c32]/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                  aria-label={
                    showConfirmPassword
                      ? "إخفاء تأكيد كلمة المرور"
                      : "إظهار تأكيد كلمة المرور"
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-xs font-bold text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#174c32] py-4 text-sm font-black text-white shadow-lg shadow-[#174c32]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#103b27] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "جاري إنشاء الحساب..."
                : "إنشاء الحساب"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              لديك حساب بالفعل؟
            </p>

            <Link
              href="/login"
              className="mt-2 inline-block text-sm font-black text-[#174c32] no-underline transition hover:text-[#d09f3d]"
            >
              تسجيل الدخول
            </Link>
          </div>

        </div>

        {/* Back Home */}
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