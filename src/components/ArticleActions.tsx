"use client";

import React, { useState } from "react";
import { Copy, Check, Share2, Bookmark, Printer, Quote, Search } from "lucide-react";

interface ArticleActionsProps {
  articleId: number;
  articleNumber: string;
  articleContent: string;
  lawTitle: string;
  lawNumber: string;
  issueYear: number;
  officialSource: string;
  onHighlightTerm?: (term: string) => void;
}

export function ArticleActions({
  articleId,
  articleNumber,
  articleContent,
  lawTitle,
  lawNumber,
  issueYear,
  officialSource,
  onHighlightTerm,
}: ArticleActionsProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [bookmarkMsg, setBookmarkMsg] = useState<string | null>(null);
  const [inSearch, setInSearch] = useState("");

  function copyText(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }

  async function toggleBookmark() {
    setBookmarkMsg(null);
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_type: "article", item_id: articleId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBookmarkMsg(data.error || "يرجى تسجيل الدخول لحفظ المادة.");
      return;
    }
    setBookmarked(Boolean(data.bookmarked));
    setBookmarkMsg(data.bookmarked ? "تم حفظ المادة في المفضلة." : "تمت إزالة المادة من المفضلة.");
  }

  const fullCitation = `${articleNumber} من ${lawTitle} (قانون رقم ${lawNumber} لسنة ${issueYear}م): "${articleContent}" — المصدر: ${officialSource}.`;

  return (
    <div className="no-print space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => copyText(articleContent, "text")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6A253]/40 bg-white px-3 py-2 text-xs font-semibold text-[#0B162C] transition hover:bg-[#F3EFE6]"
        >
          {copiedType === "text" ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5 text-[#8C6D2E]" />}
          {copiedType === "text" ? "تم نسخ النص" : "نسخ نص المادة"}
        </button>

        <button
          type="button"
          onClick={() => copyText(fullCitation, "cite")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6A253]/40 bg-white px-3 py-2 text-xs font-semibold text-[#0B162C] transition hover:bg-[#F3EFE6]"
        >
          {copiedType === "cite" ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Quote className="h-3.5 w-3.5 text-[#8C6D2E]" />}
          {copiedType === "cite" ? "تم نسخ الاستشهاد" : "نسخ المادة مع اسم القانون"}
        </button>

        <button
          type="button"
          onClick={() => copyText(window.location.href, "link")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6A253]/40 bg-white px-3 py-2 text-xs font-semibold text-[#0B162C] transition hover:bg-[#F3EFE6]"
        >
          {copiedType === "link" ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Share2 className="h-3.5 w-3.5 text-[#8C6D2E]" />}
          {copiedType === "link" ? "تم نسخ الرابط" : "مشاركة رابط المادة"}
        </button>

        <button
          type="button"
          onClick={toggleBookmark}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
            bookmarked
              ? "border-[#C6A253] bg-[#0B162C] text-[#E6C97E]"
              : "border-[#C6A253]/40 bg-white text-[#0B162C] hover:bg-[#F3EFE6]"
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          {bookmarked ? "محفوظة في المفضلة" : "حفظ في المفضلة"}
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B162C] px-3 py-2 text-xs font-semibold text-[#E6C97E] transition hover:bg-[#122344]"
        >
          <Printer className="h-3.5 w-3.5" />
          طباعة المادة
        </button>
      </div>

      {bookmarkMsg && (
        <div className="rounded-lg border border-[#C6A253]/35 bg-[#F3EFE6] px-3 py-2 text-xs text-[#0B162C]">
          {bookmarkMsg}
        </div>
      )}

      {/* Search inside article */}
      {onHighlightTerm && (
        <div className="flex items-center gap-2 rounded-xl border border-[#C6A253]/30 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-[#8C6D2E]" />
          <input
            type="text"
            value={inSearch}
            onChange={(e) => {
              setInSearch(e.target.value);
              onHighlightTerm(e.target.value);
            }}
            placeholder="ابحث داخل نص هذه المادة..."
            className="w-full bg-transparent text-xs text-[#0B162C] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
