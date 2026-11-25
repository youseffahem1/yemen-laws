import React from "react";
import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <span className="text-xs font-bold text-[#8C6D2E]">التبويب الموضوعي للتشريعات</span>
        <h1 className="mt-1 text-3xl font-bold text-[#0B162C]">تصنيفات القوانين اليمنية ({categories.length} تصنيفاً)</h1>
        <p className="mt-2 text-sm text-[#1E2430]/75">
          تغطي الموسوعة عشرين فرعاً تشريعياً رئيسياً في الجمهورية اليمنية مع عرض الأعداد الحقيقية الموثقة في كل تصنيف.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group overflow-hidden rounded-2xl border border-[#C6A253]/25 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#C6A253] hover:shadow-lg"
          >
            <div className="relative h-36 bg-[#0B162C]">
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name_ar}
                  className="h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B162C] via-[#0B162C]/50 to-transparent" />
              <div className="absolute right-4 bottom-3 left-4 flex items-end justify-between">
                <h2 className="text-lg font-bold text-[#FAF8F4]">{cat.name_ar}</h2>
                <span className="rounded-full bg-[#C6A253] px-2.5 py-0.5 text-[11px] font-bold text-[#0B162C]">
                  {cat.laws_count} تشريع
                </span>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs leading-relaxed text-[#1E2430]/75">{cat.description}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-[#8C6D2E]">
                <span>المواد المحققة: {cat.articles_count}</span>
                <span>تصفح التصنيف ←</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
