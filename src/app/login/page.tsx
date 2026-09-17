
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Errors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Errors = {};

    const email = form.email.trim();
    const password = form.password;

    // Email
    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "أدخل بريدًا إلكترونيًا صحيحًا";
    }

    // Password
    if (!password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (password.length < 8) {
      newErrors.password =
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general:
            data.error ||
            "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });

        return;
      }

      // تسجيل الدخول نجح
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general:
          "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field: keyof typeof form,
    value: string,
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

        {/* Login Card */}
        <div className="rounded-[32px] border border-[#174c32]/10 bg-white p-6 shadow-2xl shadow-[#174c32]/10 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#174c32]">
              تسجيل الدخول
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              أهلاً بعودتك 👋 سجل دخولك للوصول إلى حسابك.
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

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-black text-[#174c32]"
                >
                  كلمة المرور
                </label>

                {/* 
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#9b7730] no-underline transition hover:text-[#174c32]"
                >
                  نسيت كلمة المرور؟
                </Link>
                */}
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    updateField("password", e.target.value)
                  }
                  placeholder="أدخل كلمة المرور"
                  autoComplete="current-password"
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

            {/* Remember Me */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[#174c32]"
              />

              <span className="text-sm font-bold text-gray-500">
                تذكرني
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#174c32] py-4 text-sm font-black text-white shadow-lg shadow-[#174c32]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#103b27] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟
            </p>

            <Link
              href="/register"
              className="mt-2 inline-block text-sm font-black text-[#174c32] no-underline transition hover:text-[#d09f3d]"
            >
              إنشاء حساب جديد
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
