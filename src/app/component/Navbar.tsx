
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
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // عدد المنتجات في السلة - هنربطه بالـ Cart بعدين
 const [cartCount, setCartCount] = useState(0);

 useEffect(() => {
  async function getCartCount() {
    try {
      const response = await fetch("/api/cart", {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      const items = data.cart?.items || [];

      const count = items.reduce(
        (total: number, item: { quantity: number }) =>
          total + item.quantity,
        0,
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  } 

  getCartCount();
},[cartCount]);


  // ================= GET CURRENT USER =================

  useEffect(() => {
    
    
    async function getCurrentUser() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          setIsAdmin(false);
          return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
          const role = String(data.user.role ?? "")
            .trim()
            .toUpperCase();

          const currentUser: User = {
            id: Number(data.user.id),
            name: String(data.user.name ?? ""),
            email: String(data.user.email ?? ""),
            phone: data.user.phone ?? null,
            role,
            xcoin: Number(data.user.xcoin ?? 0),
          };

          setUser(currentUser);

          // ================= ADMIN CHECK =================

          setIsAdmin(role === "ADMIN");

      
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Get current user error:", error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoadingUser(false);
      }
    }

    getCurrentUser();
  }, []);

  // ================= LOGOUT =================

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Logout returned non-JSON:", text);

        throw new Error("Logout API did not return JSON");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Logout failed");
      }

      // مسح المستخدم من الـ Navbar
      setUser(null);
      setIsAdmin(false);

      // قفل الـ Mobile Menu
      setOpen(false);

      // Reload كامل والرجوع للرئيسية
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);

      alert("حدث خطأ أثناء تسجيل الخروج، حاول مرة أخرى");

      setLoggingOut(false);
    }
  }

  // ================= USER INITIAL =================

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[#174c32]/10 bg-[#fffdf7]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#174c32] shadow-lg shadow-[#174c32]/20 transition duration-300 group-hover:rotate-3">
            <span className="text-2xl">🐊</span>

            <div className="absolute -bottom-5 -left-5 h-10 w-10 rounded-full bg-[#d8a84e]/30" />
          </div>

          <div className="leading-none">
            <h1 className="text-[22px] font-black tracking-tight text-[#174c32]">
              التمساح
            </h1>

            <p className="mt-1.5 text-[10px] font-bold tracking-wide text-[#8b7650]">
              جودة • أصالة • ثقة
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}

        <nav className="hidden items-center gap-6 lg:flex">

          <Link
            href="#products"
            className="group relative py-2 text-[14px] font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            منتجاتنا

            <span className="absolute bottom-0 right-0 h-[2px] w-0 rounded-full bg-[#d8a84e] transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            href="#about"
            className="group relative py-2 text-[14px] font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            من نحن

            <span className="absolute bottom-0 right-0 h-[2px] w-0 rounded-full bg-[#d8a84e] transition-all duration-300 group-hover:w-full" />
          </Link>

          <Link
            href="#contact"
            className="group relative py-2 text-[14px] font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            تواصل معنا

            <span className="absolute bottom-0 right-0 h-[2px] w-0 rounded-full bg-[#d8a84e] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* ================= CART ================= */}

          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#174c32]/10 bg-white text-xl shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#d8a84e]/40 hover:bg-[#d8a84e]/10"
            aria-label="السلة"
            title="السلة"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8a84e] px-1 text-[10px] font-black text-[#174c32] shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ================= DASHBOARD ADMIN ONLY ================= */}

          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-[#d8a84e]/30 bg-[#d8a84e]/10 px-4 py-2.5 text-[13px] font-black text-[#765c28] transition hover:bg-[#d8a84e]/20"
            >
              <span>⚙️</span>
              لوحة التحكم
            </Link>
          )}
        </nav>

        {/* ================= ACCOUNT DESKTOP ================= */}

        <div className="hidden items-center gap-2 xl:flex">

          {loadingUser ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#174c32]/10" />
          ) : user ? (
            <>
              {/* Avatar */}

              <div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#174c32] text-lg font-black text-white shadow-md shadow-[#174c32]/20"
                title={user.name}
              >
                {userInitial}
              </div>

              {/* Name */}

              <span className="max-w-[120px] truncate text-sm font-black text-[#174c32]">
                {user.name}
              </span>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#174c32] transition hover:bg-[#174c32]/5"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[#174c32] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#174c32]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#103b27]"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
  <div className="flex gap-5 items-center">        <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#174c32]/10 bg-white text-xl shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#d8a84e]/40 hover:bg-[#d8a84e]/10"
            aria-label="السلة"
            title="السلة"
          >
            🛒

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d8a84e] px-1 text-[10px] font-black text-[#174c32] shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174c32]/5 text-xl text-[#174c32] lg:hidden"
          aria-label="فتح القائمة"
        >
          {open ? "✕" : "☰"}
        </button>
        </div> 
      </div>

      {/* ================= MOBILE MENU ================= */}
      

      <div
        className={`overflow-hidden border-t border-[#174c32]/5 bg-[#fffdf7] transition-all duration-300 lg:hidden ${
          open
            ? "max-h-[800px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
      
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-5">

          {/* Products */}

          <Link
            href="#products"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-black/5 py-4 font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            <span>🛍️</span>
            منتجاتنا
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-b border-black/5 py-4 font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            <div className="flex items-center gap-3">
              <span>🛒</span>
              السلة
            </div>

            {cartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#d8a84e] px-1.5 text-xs font-black text-[#174c32]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* About */}

          <Link
            href="#about"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-black/5 py-4 font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            <span>🐊</span>
            من نحن
          </Link>

          {/* Contact */}

          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-black/5 py-4 font-bold text-gray-700 transition hover:text-[#174c32]"
          >
            <span>📞</span>
            تواصل معنا
          </Link>

          {/* Dashboard Admin Only */}

          {isAdmin && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#d8a84e]/30 bg-[#d8a84e]/10 py-3.5 font-black text-[#765c28] transition hover:bg-[#d8a84e]/20"
            >
              <span>⚙️</span>
              لوحة التحكم
            </Link>
          )}

          {/* Mobile Account */}

          {!loadingUser && user ? (
            <>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#174c32]/5 p-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#174c32] text-lg font-black text-white">
                  {userInitial}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-[#174c32]">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>↪</span>

                {loggingOut
                  ? "جاري تسجيل الخروج..."
                  : "تسجيل الخروج"}
              </button>
            </>
          ) : !loadingUser ? (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-xl bg-[#174c32]/5 py-3.5 text-center font-bold text-[#174c32]"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-xl bg-[#174c32] py-3.5 text-center font-black text-white"
              >
                إنشاء حساب
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

