"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  xcoinPrice: number;
  image: string | null;
  stock: number;
};

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "حدث خطأ أثناء جلب المنتجات");
        }

        setProducts(data || []);
      } catch (error) {
        console.error("Get products error:", error);

        setError("حدث خطأ أثناء تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  return (
    <section
      id="products"
      className="bg-[#fffdf7] px-5 py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#d8a84e]" />

              <span className="text-sm font-black text-[#9b7730]">
                منتجات التمساح
              </span>
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[#174c32] sm:text-5xl">
              اختار الجودة
              <br />
              <span className="text-[#d09f3d]">
                اللي تستحقها
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-gray-500">
              مجموعة مختارة من منتجاتنا لتناسب احتياجات
              المنزل والمحلات وتجار الجملة والمطاعم.
            </p>
          </div>

          <a href="./" className="group flex w-fit items-center gap-3 rounded-xl border border-[#174c32]/10 bg-white px-5 py-3.5 text-sm font-black text-[#174c32] shadow-sm transition hover:border-[#174c32]/20 hover:shadow-md"
          >
            المنتجات المميزه

            <span className="transition-transform group-hover:-translate-x-1">
              🐊
            </span>
          </a>
        </div>

        {/* Products Grid */}

        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[470px] animate-pulse rounded-[28px] bg-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[28px] border border-[#174c32]/10 bg-white p-12 text-center">
            <div className="text-5xl">🐊</div>

            <h3 className="mt-4 text-xl font-black text-[#174c32]">
              لا توجد منتجات حاليًا
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              سيتم إضافة المنتجات قريبًا.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Wholesale Banner */}
        <div className="relative mt-16 overflow-hidden rounded-[32px] bg-[#174c32] px-7 py-10 sm:px-10 lg:px-14">

          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[#d8a84e]/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">

            <div>
              <span className="mb-3 inline-block rounded-full bg-[#d8a84e]/15 px-4 py-2 text-xs font-black text-[#f1d58e]">
                للتجار وأصحاب الأعمال
              </span>

              <h3 className="text-2xl font-black text-white sm:text-3xl">
                بتدور على أسعار الجملة؟
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">
                تواصل معنا لمعرفة عروض الجملة والتوريد للمحلات
                والمطاعم.
              </p>
            </div>

            <a
              href="#contact"
              className="shrink-0 rounded-xl bg-[#e3b65c] px-7 py-3.5 text-sm font-black text-[#174c32] transition hover:-translate-y-1 hover:bg-[#efca78]"
            >
              تواصل معنا
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}