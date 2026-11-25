import React from "react";
import Link from "next/link";
import { Search, Filter, ExternalLink, Gavel, FileText } from "lucide-react";
import { getCategoriesWithCounts, searchLegalDatabase } from "@/lib/queries";

export const dynamic = "force-dynamic";

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (terms.length === 0) return text;
  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="legal-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const q = sp.q || "";
  const category = sp.category || "";
  const year = sp.year || "";
  const lawNumber = sp.lawNumber || "";
  const status = sp.status || "";
  const authority = sp.authority || "";
  const exact = sp.exact === "1";

  const categories = getCategoriesWithCounts();
  const { articles, rulings } = searchLegalDatabase({
    q,
    category,
    year,
    lawNumber,
    status,
    authority,
    exact,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <Search className="h-4 w-4" />
          <span>محرك البحث القانوني المتقدم</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">البحث في التشريعات والمواد والمبادئ القضائية</h1>

        <form method="GET" action="/search" className="mt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="اكتب عبارة البحث، رقم المادة، المصطلح القانوني، أو اسم القانون..."
              className="flex-1 rounded-xl border border-[#C6A253]/40 bg-white/10 px-4 py-3 text-sm text-[#FAF8F4] placeholder-[#FAF8F4]/55 focus:border-[#E6C97E] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#C6A253] px-7 py-3 text-sm font-bold text-[#0B162C] transition hover:bg-[#E6C97E]"
            >
              تنفيذ البحث
            </button>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-5">
            <select
              name="category"
              defaultValue={category}
              className="rounded-lg border border-white/15 bg-[#122344] px-3 py-2 text-xs text-[#FAF8F4]"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name_ar}</option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              defaultValue={year}
              placeholder="سنة الإصدار (مثال: 2002)"
              className="rounded-lg border border-white/15 bg-[#122344] px-3 py-2 text-xs text-[#FAF8F4] placeholder-[#FAF8F4]/50"
            />

            <input
              type="text"
              name="lawNumber"
              defaultValue={lawNumber}
              placeholder="رقم القانون (مثال: 14)"
              className="rounded-lg border border-white/15 bg-[#122344] px-3 py-2 text-xs text-[#FAF8F4] placeholder-[#FAF8F4]/50"
            />

            <select
              name="status"
              defaultValue={status}
              className="rounded-lg border border-white/15 bg-[#122344] px-3 py-2 text-xs text-[#FAF8F4]"
            >
              <option value="">حالة التشريع (الكل)</option>
              <option value="ساري">ساري</option>
              <option value="معدل">معدل</option>
              <option value="ملغى">ملغى</option>
            </select>

            <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#122344] px-3 py-2 text-xs text-[#FAF8F4]">
              <input type="checkbox" name="exact" value="1" defaultChecked={exact} className="accent-[#C6A253]" />
              <span>تطابق العبارة كاملة</span>
            </label>
          </div>
        </form>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between text-xs text-[#1E2430]/75">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#8C6D2E]" />
          <span>
            عثر محرك البحث على <strong className="text-[#0B162C]">{articles.length}</strong> مادة تشريعية و{" "}
            <strong className="text-[#0B162C]">{rulings.length}</strong> مبدأ قضائي
            {q ? ` لعبارة "${q}"` : ""}.
          </span>
        </div>
      </div>

      {/* Legislative Results */}
      <div className="space-y-4">
        {articles.map((item) => (
          <div
            key={String(item.article_id)}
            className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm transition hover:border-[#C6A253]"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-[#0B162C] px-2.5 py-1 text-xs font-bold text-[#E6C97E]">
                  <FileText className="h-3.5 w-3.5" />
                  {String(item.article_number)}
                </span>
                <span className="rounded bg-[#F3EFE6] px-2.5 py-1 text-xs font-semibold text-[#8C6D2E]">
                  {String(item.category_name)}
                </span>
                <span className="rounded bg-emerald-900/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                  {String(item.law_status)}
                </span>
              </div>
              <Link
                href={`/articles/${String(item.article_id)}`}
                className="text-xs font-bold text-[#0B162C] hover:text-[#8C6D2E]"
              >
                فتح المادة كاملة ←
              </Link>
            </div>

            <h2 className="mt-3 text-base font-bold text-[#0B162C]">
              <Link href={`/laws/${String(item.law_slug)}`} className="hover:underline">
                {String(item.law_title)}
              </Link>
              {item.article_title ? ` — ${highlightText(String(item.article_title), q)}` : ""}
            </h2>

            <p className="legal-text mt-2 text-sm text-[#1E2430]/90">
              {highlightText(String(item.content), q)}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#C6A253]/15 pt-3 text-[11px] text-[#1E2430]/65">
              <span>المصدر: {String(item.official_source)}</span>
              {item.official_source_url ? (
                <a
                  href={String(item.official_source_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#8C6D2E] hover:underline"
                >
                  رابط المصدر <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </div>
        ))}

        {rulings.length > 0 && (
          <div className="mt-10 space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-[#0B162C]">
              <Gavel className="h-5 w-5 text-[#8C6D2E]" />
              نتائج المبادئ والأحكام القضائية
            </h2>
            {rulings.map((r) => (
              <div key={String(r.id)} className="rounded-2xl border border-[#C6A253]/35 bg-[#F3EFE6] p-6">
                <div className="flex items-center justify-between text-xs font-bold text-[#8C6D2E]">
                  <span>{String(r.court)} — {String(r.chamber)}</span>
                  <span>{String(r.case_type)}</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-[#0B162C]">
                  {highlightText(String(r.dispute_subject), q)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1E2430]">
                  {highlightText(String(r.principle), q)}
                </p>
              </div>
            ))}
          </div>
        )}

        {articles.length === 0 && rulings.length === 0 && (
          <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-12 text-center">
            <h3 className="text-lg font-bold text-[#0B162C]">لم يتم العثور على نتائج مطابقة</h3>
            <p className="mt-2 text-xs text-[#1E2430]/70">
              جرّب البحث بكلمات أوسع أو إزالة بعض الفلاتر (مثل السنة أو رقم القانون).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
