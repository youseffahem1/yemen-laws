import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, ExternalLink, BookOpen } from "lucide-react";
import { getArticleDetail } from "@/lib/queries";
import { ArticleActions } from "@/components/ArticleActions";

export const dynamic = "force-dynamic";

export default async function ArticleViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getArticleDetail(Number(id));
  if (!data) notFound();

  const { article, prevArticle, nextArticle, related } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="no-print mb-6 flex flex-wrap items-center gap-2 text-xs text-[#1E2430]/70">
        <Link href="/" className="hover:text-[#0B162C]">الرئيسية</Link>
        <span>/</span>
        <Link href={`/laws/${String(article.law_slug)}`} className="hover:text-[#0B162C]">
          {String(article.law_title)}
        </Link>
        <span>/</span>
        <span className="font-bold text-[#0B162C]">{String(article.article_number)}</span>
      </nav>

      {/* Main Article Card */}
      <div className="rounded-2xl border border-[#C6A253]/35 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#C6A253]/20 pb-4">
          <div>
            <span className="text-xs font-bold text-[#8C6D2E]">
              {String(article.law_title)} — قانون رقم ({String(article.law_number)}) لسنة {String(article.issue_year)}م
            </span>
            {(article.chapter_title || article.section_title) ? (
              <div className="mt-1 text-xs text-[#1E2430]/70">
                {article.chapter_label ? `${String(article.chapter_label)}: ${String(article.chapter_title)}` : ""}
                {article.section_label ? ` / ${String(article.section_label)}: ${String(article.section_title)}` : ""}
              </div>
            ) : null}
          </div>
          <span className="rounded-lg bg-[#0B162C] px-4 py-1.5 text-sm font-bold text-[#E6C97E]">
            {String(article.article_number)}
          </span>
        </div>

        {article.title ? (
          <h1 className="mt-5 text-2xl font-bold text-[#0B162C]">{String(article.title)}</h1>
        ) : null}

        <div className="legal-text my-6 whitespace-pre-line rounded-xl bg-[#FAF8F4] p-6 text-lg text-[#1E2430] sm:text-xl">
          {String(article.content)}
        </div>

        <ArticleActions
          articleId={Number(article.id)}
          articleNumber={String(article.article_number)}
          articleContent={String(article.content)}
          lawTitle={String(article.law_title)}
          lawNumber={String(article.law_number)}
          issueYear={Number(article.issue_year)}
          officialSource={String(article.official_source || article.law_source)}
        />

        {/* Source & Amendments */}
        <div className="mt-6 rounded-xl border border-[#C6A253]/25 bg-[#F3EFE6] p-4 text-xs text-[#1E2430]/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>المصدر الرسمي للمادة:</strong> {String(article.official_source || article.law_source)}
            </span>
            {article.law_source_url ? (
              <a
                href={String(article.law_source_url)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#8C6D2E] hover:underline"
              >
                الرابط الرسمي <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
          {article.amendment_note ? (
            <p className="mt-2 text-[#8C6D2E]">
              <strong>ملاحظة تعديل تشريعي:</strong> {String(article.amendment_note)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <div className="no-print mt-6 grid gap-4 sm:grid-cols-2">
        {prevArticle ? (
          <Link
            href={`/articles/${prevArticle.id}`}
            className="flex items-center gap-3 rounded-xl border border-[#C6A253]/30 bg-white p-4 transition hover:border-[#C6A253]"
          >
            <ArrowRight className="h-5 w-5 text-[#8C6D2E]" />
            <div>
              <div className="text-[11px] text-[#1E2430]/60">المادة السابقة</div>
              <div className="text-sm font-bold text-[#0B162C]">{prevArticle.article_number}</div>
            </div>
          </Link>
        ) : <div />}

        {nextArticle ? (
          <Link
            href={`/articles/${nextArticle.id}`}
            className="flex items-center justify-end gap-3 rounded-xl border border-[#C6A253]/30 bg-white p-4 text-left transition hover:border-[#C6A253]"
          >
            <div>
              <div className="text-[11px] text-[#1E2430]/60">المادة التالية</div>
              <div className="text-sm font-bold text-[#0B162C]">{nextArticle.article_number}</div>
            </div>
            <ArrowLeft className="h-5 w-5 text-[#8C6D2E]" />
          </Link>
        ) : <div />}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="no-print mt-10 rounded-2xl border border-[#C6A253]/25 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-[#0B162C]">
            <BookOpen className="h-4 w-4 text-[#8C6D2E]" />
            مواد أخرى من نفس التشريع
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/articles/${r.id}`}
                className="rounded-xl border border-[#C6A253]/20 bg-[#FAF8F4] p-3 text-xs transition hover:border-[#C6A253]"
              >
                <span className="font-bold text-[#8C6D2E]">{r.article_number}</span>
                {r.title && <span className="mr-2 font-semibold text-[#0B162C]">— {r.title}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
