
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  xcoin: number;
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function getUser() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          if (!cancelled) {
            window.location.href = "/login";
          }
          return;
        }

        if (!cancelled) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Profile error:", error);

        if (!cancelled) {
          window.location.href = "/login";
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getUser();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[#f8fafc]"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1a5f7a]" />

          <p className="text-gray-600">
            جاري تحميل بياناتك...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const createdDate = new Date(user.createdAt).toLocaleDateString(
    "ar-EG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#eef7f8] via-white to-white px-4 py-10"
    >
      <div className="mx-auto max-w-4xl">

        {/* Profile Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#1a5f7a] text-4xl font-bold text-white shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            {user.name}
          </h1>

          <p className="mt-2 text-gray-500">
            مرحباً بك في حسابك 👋
          </p>
        </div>

        {/* XCoin */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#123f52] to-[#1a5f7a] p-6 text-white shadow-xl">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div>
              <p className="text-sm text-white/70">
                رصيدك الحالي
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="text-4xl">
                  🪙
                </span>

                <span className="text-4xl font-extrabold">
                  {user.xcoin}
                </span>

                <span className="text-lg text-white/80">
                  XCoin
                </span>
              </div>

              <p className="mt-2 text-sm text-white/60">
                رصيد العملات الرقمية الخاصة بحسابك
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur">
              💲
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              معلومات الحساب
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              البيانات المسجلة في حسابك
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Name */}
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f6]">
                  👤
                </div>

                <span className="text-sm text-gray-500">
                  الاسم
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {user.name}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f6]">
                  📧
                </div>

                <span className="text-sm text-gray-500">
                  البريد الإلكتروني
                </span>
              </div>

              <p className="break-all font-semibold text-gray-900">
                {user.email}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f6]">
                  📱
                </div>

                <span className="text-sm text-gray-500">
                  رقم الهاتف
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {user.phone || "لم يتم إضافة رقم هاتف"}
              </p>
            </div>

            {/* Role */}
            <div className="rounded-2xl bg-gray-50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f6]">
                  🛡️
                </div>

                <span className="text-sm text-gray-500">
                  نوع الحساب
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {user.role === "ADMIN" ? "مدير" : "مستخدم"}
              </p>
            </div>

            {/* Created At */}
            <div className="rounded-2xl bg-gray-50 p-5 sm:col-span-2">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3f6]">
                  📅
                </div>

                <span className="text-sm text-gray-500">
                  تاريخ إنشاء الحساب
                </span>
              </div>

              <p className="font-semibold text-gray-900">
                {createdDate}
              </p>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-[#1a5f7a] px-6 py-4 text-center font-semibold text-white transition hover:bg-[#144b60]"
          >
            العودة للرئيسية
          </Link>

          <Link
            href="/#products"
            className="flex-1 rounded-2xl border border-gray-200 bg-white px-6 py-4 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            تصفح المنتجات
          </Link>
        </div>

      </div>
    </main>
  );
}

