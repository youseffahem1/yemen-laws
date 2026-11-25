import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriesWithCounts, getLaws } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = getCategoriesWithCounts();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const laws = getLaws({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <Link href="/categories" className="text-xs text-[#E6C97E] hover:underline">
          ← العودة إلى جميع التصنيفات
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{category.name_ar}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#FAF8F4]/75">{category.description}</p>
        <div className="mt-4 flex gap-4 text-xs text-[#D6B978]">
          <span>التشريعات الموثقة: {laws.length}</span>
          <span>•</span>
          <span>المواد المحققة: {category.articles_count}</span>
        </div>
      </div>

      {laws.length === 0 ? (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-[#0B162C]">لا توجد تشريعات مدرجة في هذا التصنيف حالياً</h2>
          <p className="mt-2 text-xs text-[#1E2430]/70">
            تلتزم الموسوعة بعدم إدراج نصوص غير محققة من مصادرها الرسمية. يمكن للمحررين ومدير النظام إضافة التشريعات الموثقة عبر لوحة الإدارة.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {laws.map((law) => (
            <Link
              key={law.id}
              href={`/laws/${law.slug}`}
              className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 transition hover:border-[#C6A253] hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8C6D2E]">رقم ({law.law_number}) لسنة {law.issue_year}</span>
                <span className="rounded-full bg-emerald-900/10 px-2.5 py-0.5 font-semibold text-emerald-800">{law.status}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-[#0B162C]">{law.title}</h2>
              <p className="mt-2 text-xs text-[#1E2430]/75">{law.summary}</p>
              <div className="mt-4 text-xs font-semibold text-[#0B162C]">
                المواد المدرجة: {law.articles_count} • استعراض النص ←
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
