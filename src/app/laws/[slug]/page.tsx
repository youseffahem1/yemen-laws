import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, FileText, ShieldCheck, Calendar, Building2, Layers, BookOpen } from "lucide-react";
import { getLawBySlug } from "@/lib/queries";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LawDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getLawBySlug(slug);
  if (!data) notFound();

  const { law, chapters, sections, articles, amendments } = data;

  // Increment real view counter
  try {
    getDb().prepare("UPDATE laws SET views_count = views_count + 1 WHERE id = ?").run(law.id);
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#1E2430]/70">
        <Link href="/" className="hover:text-[#0B162C]">الرئيسية</Link>
        <span>/</span>
        <Link href="/encyclopedia" className="hover:text-[#0B162C]">الموسوعة التشريعية</Link>
        <span>/</span>
        <Link href={`/categories/${law.category_slug}`} className="hover:text-[#0B162C]">{law.category_name}</Link>
        <span>/</span>
        <span className="font-bold text-[#0B162C]">{law.title}</span>
      </nav>

      {/* Law Metadata Card */}
      <div className="rounded-2xl border border-[#C6A253]/35 bg-[#0B162C] p-6 text-[#FAF8F4] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-[#C6A253]/40 bg-[#C6A253]/15 px-3 py-1 text-xs font-semibold text-[#E6C97E]">
            {law.category_name}
          </span>
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
            حالة التشريع: {law.status}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl">{law.title}</h1>
        {law.summary && <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[#FAF8F4]/80">{law.summary}</p>}

        <div className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#E6C97E]" />
            <span>رقم القانون: <strong>{law.law_number}</strong> لسنة <strong>{law.issue_year}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#E6C97E]" />
            <span>تاريخ الإصدار: <strong>{law.issue_date || "غير محدد"}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#E6C97E]" />
            <span>الجهة المصدرة: <strong>{law.issuing_authority}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#E6C97E]" />
            <span>الأبواب: <strong>{chapters.length}</strong> | الفصول: <strong>{sections.length}</strong> | المواد: <strong>{articles.length}</strong></span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-[#FAF8F4]/75">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#E6C97E]">
              <ShieldCheck className="h-4 w-4" />
              {law.verification_status}
            </span>
            <span>آخر مراجعة: {law.last_reviewed_at || "غير محدد"}</span>
            {law.official_gazette_no && <span>الجريدة الرسمية: {law.official_gazette_no}</span>}
          </div>
          <div className="flex items-center gap-3">
            {law.official_source_url && (
              <a
                href={law.official_source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-[#C6A253]/40 px-3 py-1.5 text-[#E6C97E] hover:bg-white/10"
              >
                المصدر الرسمي ({law.official_source}) <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {law.pdf_url && (
              <a
                href={law.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#C6A253] px-3 py-1.5 font-bold text-[#0B162C]"
              >
                تحميل PDF الرسمي
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Amendments & Superseding Info */}
      {(amendments.length > 0 || law.supersedes || law.superseded_by) && (
        <div className="mt-6 rounded-xl border border-[#C6A253]/30 bg-[#F3EFE6] p-5 text-xs">
          <h2 className="text-sm font-bold text-[#0B162C]">التعديلات والتاريخ التشريعي</h2>
          {law.supersedes && <p className="mt-1">حلّ محل: <strong>{law.supersedes}</strong></p>}
          {law.superseded_by && <p className="mt-1 text-red-800">تم نسخه/تعديله بموجب: <strong>{law.superseded_by}</strong></p>}
          {amendments.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {amendments.map((am) => (
                <li key={am.id} className="rounded-lg bg-white/80 p-2.5">
                  <strong className="text-[#8C6D2E]">{am.amending_law_title} ({am.amendment_year}):</strong>{" "}
                  {am.summary}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main Content & Sidebar TOC */}
      <div className="mt-10 grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[#C6A253]/30 bg-white p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0B162C]">
              <BookOpen className="h-4 w-4 text-[#8C6D2E]" />
              فهرس القانون والمواد
            </h2>
            {chapters.length > 0 && (
              <div className="mb-4 space-y-1.5">
                {chapters.map((ch) => (
                  <a
                    key={ch.id}
                    href={`#ch-${ch.id}`}
                    className="block rounded-lg px-2.5 py-1.5 text-xs text-[#1E2430]/85 hover:bg-[#F3EFE6]"
                  >
                    <strong className="text-[#8C6D2E]">{ch.number_label}:</strong> {ch.title}
                  </a>
                ))}
              </div>
            )}
            {articles.length > 0 && (
              <div className="border-t border-[#C6A253]/20 pt-3">
                <div className="mb-2 text-[11px] font-bold text-[#1E2430]/60">انتقال سريع للمواد</div>
                <div className="flex flex-wrap gap-1.5">
                  {articles.map((art) => (
                    <a
                      key={art.id}
                      href={`#art-${art.id}`}
                      className="rounded border border-[#C6A253]/30 px-2 py-0.5 text-[11px] font-medium text-[#0B162C] hover:bg-[#0B162C] hover:text-[#E6C97E]"
                    >
                      {art.article_number.replace("المادة ", "")}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-3">
          {articles.length === 0 ? (
            <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-8 text-center">
              <h3 className="text-lg font-bold text-[#0B162C]">بطاقة تشريعية موثقة</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">
                تم توثيق البيانات الرسمية لهذا التشريع وتعديلاته، والنص التفصيلي لمواده قيد الإدراج والتحقق الحرفي من الجريدة الرسمية.
              </p>
            </div>
          ) : (
            chapters.map((ch) => {
              const chArticles = articles.filter((a) => a.chapter_id === ch.id);
              return (
                <section key={ch.id} id={`ch-${ch.id}`} className="space-y-4">
                  <div className="border-b-2 border-[#C6A253] pb-2">
                    <span className="text-xs font-bold text-[#8C6D2E]">{ch.number_label}</span>
                    <h2 className="text-xl font-bold text-[#0B162C]">{ch.title}</h2>
                  </div>
                  {chArticles.map((art) => (
                    <article
                      key={art.id}
                      id={`art-${art.id}`}
                      className="rounded-xl border border-[#C6A253]/25 bg-white p-6 shadow-sm transition hover:border-[#C6A253]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md bg-[#0B162C] px-3 py-1 text-xs font-bold text-[#E6C97E]">
                          {art.article_number}
                        </span>
                        <Link
                          href={`/articles/${art.id}`}
                          className="text-xs font-bold text-[#8C6D2E] hover:underline"
                        >
                          عارض المادة والأدوات (نسخ / مفضلة / طباعة) ←
                        </Link>
                      </div>
                      {art.title && <h3 className="mt-3 text-base font-bold text-[#0B162C]">{art.title}</h3>}
                      <p className="legal-text mt-2 whitespace-pre-line text-base text-[#1E2430]">{art.content}</p>
                    </article>
                  ))}
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
