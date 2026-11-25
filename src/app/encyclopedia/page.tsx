import React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, FileCheck2 } from "lucide-react";
import { getCategoriesWithCounts, getLaws } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function EncyclopediaPage() {
  const laws = getLaws();
  const categories = getCategoriesWithCounts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <BookOpen className="h-4 w-4" />
          <span>الموسوعة التشريعية اليمنية</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">سجل التشريعات والقوانين الموثقة</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#FAF8F4]/75">
          تضم الموسوعة النصوص التشريعية اليمنية المحققة من مصادرها الرسمية مع بيان رقم القانون، سنة الإصدار،
          الجهة المصدرة، حالة السريان، والتعديلات المرتبطة بكل تشريع.
        </p>
      </div>

      {/* Quick Category Pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="rounded-full border border-[#C6A253]/35 bg-white px-3.5 py-1.5 text-xs font-medium text-[#0B162C] transition hover:border-[#C6A253] hover:bg-[#0B162C] hover:text-[#FAF8F4]"
          >
            {cat.name_ar} ({cat.laws_count})
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {laws.map((law) => (
          <div
            key={law.id}
            className="flex flex-col justify-between rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm transition hover:border-[#C6A253] hover:shadow-md"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-[#0B162C] px-2.5 py-1 text-[11px] font-semibold text-[#E6C97E]">
                  {law.category_name}
                </span>
                <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                  {law.status}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-[#0B162C]">
                <Link href={`/laws/${law.slug}`} className="hover:text-[#8C6D2E]">
                  {law.title}
                </Link>
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">{law.summary}</p>
            </div>

            <div className="mt-5 border-t border-[#C6A253]/20 pt-4">
              <div className="grid grid-cols-2 gap-2 text-xs text-[#1E2430]/75 sm:grid-cols-3">
                <div>رقم القانون: <strong className="text-[#0B162C]">{law.law_number}</strong></div>
                <div>سنة الإصدار: <strong className="text-[#0B162C]">{law.issue_year}</strong></div>
                <div>المواد المدرجة: <strong className="text-[#0B162C]">{law.articles_count}</strong></div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[#8C6D2E]">
                <span className="inline-flex items-center gap-1">
                  <FileCheck2 className="h-3.5 w-3.5" />
                  {law.verification_status}
                </span>
                <div className="flex items-center gap-3">
                  {law.official_source_url && (
                    <a
                      href={law.official_source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#0B162C]/70 hover:text-[#0B162C]"
                    >
                      المصدر الرسمي <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <Link
                    href={`/laws/${law.slug}`}
                    className="rounded-lg bg-[#0B162C] px-3 py-1.5 font-bold text-[#E6C97E] hover:bg-[#122344]"
                  >
                    استعراض القانون ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
