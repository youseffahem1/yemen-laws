import React from "react";
import Link from "next/link";
import { Scale, ExternalLink, ShieldCheck } from "lucide-react";
import { getLawBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function ConstitutionPage() {
  const data = getLawBySlug("yemen-constitution-1991");

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#0B162C]">دستور الجمهورية اليمنية</h1>
        <p className="mt-2 text-sm text-[#1E2430]/70">لم يتم العثور على الوثيقة الدستورية.</p>
      </div>
    );
  }

  const { law, chapters, articles, amendments } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A253]/40 bg-[#C6A253]/15 px-3 py-1 text-xs font-semibold text-[#E6C97E]">
            <Scale className="h-3.5 w-3.5" />
            <span>الوثيقة الدستورية العليا للجمهورية اليمنية</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{law.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#FAF8F4]/80">{law.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#D6B978]">
            <span>تاريخ الإقرار: {law.issue_date}</span>
            <span>•</span>
            <span>الحالة: {law.status}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {law.verification_status}
            </span>
            {law.official_source_url && (
              <a
                href={law.official_source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline hover:text-[#FAF8F4]"
              >
                المصدر الرسمي ({law.official_source}) <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Amendments */}
      {amendments.length > 0 && (
        <div className="mt-6 rounded-xl border border-[#C6A253]/35 bg-[#F3EFE6] p-5">
          <h2 className="text-sm font-bold text-[#0B162C]">التعديلات الدستورية الموثقة</h2>
          {amendments.map((am) => (
            <div key={am.id} className="mt-2 text-xs text-[#1E2430]/85">
              <strong className="text-[#8C6D2E]">{am.amending_law_title}:</strong> {am.summary}
            </div>
          ))}
        </div>
      )}

      {/* Chapters & Articles */}
      <div className="mt-10 grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#C6A253]/30 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-[#0B162C]">فهرس الأبواب الدستورية</h2>
            <ul className="space-y-2 text-xs">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <a href={`#chapter-${ch.id}`} className="block rounded-lg px-2.5 py-1.5 text-[#1E2430]/80 hover:bg-[#F3EFE6] hover:text-[#0B162C]">
                    <span className="font-bold text-[#8C6D2E]">{ch.number_label}:</span> {ch.title}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href={`/laws/${law.slug}`}
              className="mt-4 block rounded-lg bg-[#0B162C] px-3 py-2 text-center text-xs font-bold text-[#E6C97E]"
            >
              عرض البطاقة التشريعية الكاملة
            </Link>
          </div>
        </aside>

        <div className="space-y-8 lg:col-span-3">
          {chapters.map((ch) => {
            const chArticles = articles.filter((a) => a.chapter_id === ch.id);
            return (
              <section key={ch.id} id={`chapter-${ch.id}`} className="space-y-4">
                <div className="border-b-2 border-[#C6A253] pb-2">
                  <span className="text-xs font-bold text-[#8C6D2E]">{ch.number_label}</span>
                  <h2 className="text-xl font-bold text-[#0B162C]">{ch.title}</h2>
                </div>
                {chArticles.map((art) => (
                  <div
                    key={art.id}
                    className="rounded-xl border border-[#C6A253]/25 bg-white p-6 shadow-sm transition hover:border-[#C6A253]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-[#0B162C] px-3 py-1 text-xs font-bold text-[#E6C97E]">
                        {art.article_number}
                      </span>
                      <Link
                        href={`/articles/${art.id}`}
                        className="text-xs font-semibold text-[#8C6D2E] hover:underline"
                      >
                        فتح المادة والأدوات ←
                      </Link>
                    </div>
                    {art.title && <h3 className="mt-3 text-base font-bold text-[#0B162C]">{art.title}</h3>}
                    <p className="legal-text mt-2 whitespace-pre-line text-base text-[#1E2430]">{art.content}</p>
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
