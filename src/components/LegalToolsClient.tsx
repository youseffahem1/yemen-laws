"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { diffWords } from "diff";
import {
  GitCompare,
  FileSearch,
  Quote,
  StickyNote,
  ListChecks,
  Download,
  Printer,
  Copy,
  Check,
  FileUp,
  History,
  Bookmark,
} from "lucide-react";

interface SimpleArticle {
  id: number;
  law_id: number;
  law_title: string;
  law_number: string;
  issue_year: number;
  article_number: string;
  title: string | null;
  content: string;
  official_source: string | null;
}

export function LegalToolsClient({
  articles,
  isLoggedIn,
}: {
  articles: SimpleArticle[];
  isLoggedIn: boolean;
}) {
  const [activeTab, setActiveTab] = useState<
    "diff" | "compare-articles" | "doc-search" | "pdf-ocr" | "citation" | "notes" | "lists" | "recent"
  >("diff");

  // 1 & 11: Text Diff / Amendment Comparison
  const [textA, setTextA] = useState(
    "تنتخب هيئة مجلس النواب لمدة خمس سنوات ميلادية تبدأ من تاريخ أول اجتماع له."
  );
  const [textB, setTextB] = useState(
    "مدة مجلس النواب ست سنوات ميلادية تبدأ من تاريخ أول اجتماع له وفق التعديلات الدستورية لسنة 2001م."
  );
  const diffResult = diffWords(textA, textB);

  // 2: Compare two articles from DB
  const [art1Id, setArt1Id] = useState<number>(articles[0]?.id || 0);
  const [art2Id, setArt2Id] = useState<number>(articles[1]?.id || articles[0]?.id || 0);
  const art1 = articles.find((a) => a.id === art1Id);
  const art2 = articles.find((a) => a.id === art2Id);

  // 4: Search inside document
  const [docText, setDocText] = useState(articles[0]?.content || "");
  const [docQuery, setDocQuery] = useState("");
  const docMatches = docQuery.trim()
    ? docText.split(new RegExp(`(${docQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
    : [docText];
  const matchCount = docQuery.trim()
    ? (docText.match(new RegExp(docQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length
    : 0;

  // 3: PDF Text Extraction
  const [pdfText, setPdfText] = useState("");
  const [pdfStatus, setPdfStatus] = useState("");
  async function handlePdfExtract(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfStatus("جاري قراءة ملف PDF...");
    try {
      const buffer = await file.arrayBuffer();
      const raw = new TextDecoder("latin1").decode(buffer);
      // Extract readable text segments inside PDF literal parentheses
      const matches = raw.match(/\(([^()]{2,200})\)/g) || [];
      const cleaned = matches
        .map((m) => m.slice(1, -1).replace(/\\[nrt]/g, " "))
        .filter((s) => /[a-zA-Z0-9\u0600-\u06FF]/.test(s))
        .join(" ");
      if (cleaned.trim().length > 20) {
        setPdfText(cleaned);
        setPdfStatus(`تم استخراج النص من (${file.name}) بنجاح.`);
      } else {
        setPdfText("");
        setPdfStatus(
          `الملف (${file.name}) قد يكون ممسوحاً ضوئياً كصور (Scanned PDF) أو مشفراً؛ يتطلب محرك OCR خارجياً للنصوص المصورة.`
        );
      }
    } catch {
      setPdfStatus("تعذر قراءة الملف.");
    }
  }

  // 10: Citation Generator
  const [citeArtId, setCiteArtId] = useState<number>(articles[0]?.id || 0);
  const [copiedCite, setCopiedCite] = useState(false);
  const citeArt = articles.find((a) => a.id === citeArtId);
  const generatedCitation = citeArt
    ? `${citeArt.article_number} من ${citeArt.law_title} (قانون رقم ${citeArt.law_number} لسنة ${citeArt.issue_year}م)، النص: "${citeArt.content}" — المصدر: ${citeArt.official_source || "الجريدة الرسمية للجمهورية اليمنية"}.`
    : "";

  // 8: Notes
  const [notes, setNotes] = useState<{ id: number; title: string; content: string; created_at: string }[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteMsg, setNoteMsg] = useState("");

  // 6: Reading Lists
  const [lists, setLists] = useState<{ id: number; title: string; description: string }[]>([]);
  const [listTitle, setListTitle] = useState("");
  const [listDesc, setListDesc] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/notes")
      .then((r) => (r.ok ? r.json() : { notes: [] }))
      .then((d) => setNotes(d.notes || []))
      .catch(() => {});
    fetch("/api/reading-lists")
      .then((r) => (r.ok ? r.json() : { lists: [] }))
      .then((d) => setLists(d.lists || []))
      .catch(() => {});
  }, [isLoggedIn]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    setNoteMsg("");
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: noteTitle, content: noteContent }),
    });
    const d = await res.json();
    if (!res.ok) {
      setNoteMsg(d.error || "تعذر حفظ الملاحظة.");
      return;
    }
    setNotes((prev) => [{ id: d.id, title: noteTitle, content: noteContent, created_at: "الآن" }, ...prev]);
    setNoteTitle("");
    setNoteContent("");
    setNoteMsg("تم حفظ الملاحظة في قاعدة البيانات.");
  }

  async function addReadingList(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/reading-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: listTitle, description: listDesc }),
    });
    const d = await res.json();
    if (res.ok) {
      setLists((prev) => [{ id: d.id, title: listTitle, description: listDesc }, ...prev]);
      setListTitle("");
      setListDesc("");
    }
  }

  function exportTextFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs = [
    { id: "diff", label: "مقارنة النصوص والتعديلات", icon: GitCompare },
    { id: "compare-articles", label: "مقارنة مواد قانونين", icon: GitCompare },
    { id: "doc-search", label: "البحث داخل مستند", icon: FileSearch },
    { id: "pdf-ocr", label: "استخراج النص من PDF", icon: FileUp },
    { id: "citation", label: "مولد الاستشهاد والتصدير", icon: Quote },
    { id: "notes", label: "الملاحظات القانونية", icon: StickyNote },
    { id: "lists", label: "قوائم المراجع", icon: ListChecks },
    { id: "recent", label: "الوصول السريع والمفضلة", icon: History },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Tool Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? "bg-[#0B162C] text-[#E6C97E] shadow"
                  : "border border-[#C6A253]/30 bg-white text-[#0B162C] hover:border-[#C6A253]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 1 & 11. Diff Tool */}
      {activeTab === "diff" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة مقارنة النصوص القانونية وعرض التعديلات</h2>
          <p className="mt-1 text-xs text-[#1E2430]/70">
            قارن بين نصين تشريعيين أو نسختين من القانون قبل التعديل وبعده لإظهار الإضافات والحذوفات بدقة.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#0B162C]">النص الأصلي (النسخة الأولى)</label>
              <textarea
                rows={5}
                value={textA}
                onChange={(e) => setTextA(e.target.value)}
                className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#0B162C]">النص المعدل (النسخة الثانية)</label>
              <textarea
                rows={5}
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-5">
            <div className="mb-2 text-xs font-bold text-[#8C6D2E]">نتيجة المقارنة التفاعلية:</div>
            <div className="legal-text text-base leading-loose">
              {diffResult.map((part, idx) => (
                <span
                  key={idx}
                  className={
                    part.added
                      ? "rounded bg-emerald-200/80 px-1 font-bold text-emerald-950"
                      : part.removed
                      ? "rounded bg-red-200/80 px-1 text-red-950 line-through"
                      : ""
                  }
                >
                  {part.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Compare Two DB Articles */}
      {activeTab === "compare-articles" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة مقارنة مواد قانونين من الموسوعة</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <select
              value={art1Id}
              onChange={(e) => setArt1Id(Number(e.target.value))}
              className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs font-semibold"
            >
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.law_title} — {a.article_number}
                </option>
              ))}
            </select>
            <select
              value={art2Id}
              onChange={(e) => setArt2Id(Number(e.target.value))}
              className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs font-semibold"
            >
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.law_title} — {a.article_number}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {art1 && (
              <div className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-5">
                <div className="text-xs font-bold text-[#8C6D2E]">{art1.law_title} — {art1.article_number}</div>
                <p className="legal-text mt-2 text-sm">{art1.content}</p>
              </div>
            )}
            {art2 && (
              <div className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-5">
                <div className="text-xs font-bold text-[#8C6D2E]">{art2.law_title} — {art2.article_number}</div>
                <p className="legal-text mt-2 text-sm">{art2.content}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Search Inside Document */}
      {activeTab === "doc-search" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة البحث داخل مستند قانوني</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={docQuery}
              onChange={(e) => setDocQuery(e.target.value)}
              placeholder="اكتب الكلمة أو العبارة المراد البحث عنها داخل المستند..."
              className="flex-1 rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-4 py-2.5 text-sm"
            />
            <span className="inline-flex items-center rounded-xl bg-[#0B162C] px-4 py-2 text-xs font-bold text-[#E6C97E]">
              عدد المطابقات: {matchCount}
            </span>
          </div>
          <textarea
            rows={5}
            value={docText}
            onChange={(e) => setDocText(e.target.value)}
            placeholder="الصق نص المستند القانوني هنا..."
            className="mt-4 w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-sm"
          />
          <div className="legal-text mt-4 rounded-xl border border-[#C6A253]/20 bg-[#FAF8F4] p-4 text-sm">
            {docMatches.map((part, i) =>
              docQuery.trim() && part.toLowerCase() === docQuery.trim().toLowerCase() ? (
                <mark key={i} className="legal-highlight">{part}</mark>
              ) : (
                part
              )
            )}
          </div>
        </div>
      )}

      {/* 3. PDF Text Extraction */}
      {activeTab === "pdf-ocr" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة استخراج النص من ملفات PDF</h2>
          <p className="mt-1 text-xs text-[#1E2430]/75">
            ارفع ملف PDF تشريعياً لاستخراج النصوص البرمجية المضمنة فيه أو فحصه.
          </p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfExtract}
            className="mt-4 block w-full rounded-xl border border-dashed border-[#C6A253] bg-[#FAF8F4] p-4 text-xs"
          />
          {pdfStatus && <p className="mt-3 text-xs font-bold text-[#8C6D2E]">{pdfStatus}</p>}
          {pdfText && (
            <textarea
              readOnly
              rows={8}
              value={pdfText}
              className="mt-4 w-full rounded-xl border border-[#C6A253]/30 bg-[#FAF8F4] p-4 text-xs"
            />
          )}
        </div>
      )}

      {/* 7 & 10. Citation & Export */}
      {activeTab === "citation" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة نسخ الاستشهاد القانوني وتصدير المواد</h2>
          <select
            value={citeArtId}
            onChange={(e) => setCiteArtId(Number(e.target.value))}
            className="mt-4 w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs font-semibold"
          >
            {articles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.law_title} — {a.article_number}
              </option>
            ))}
          </select>
          <div className="legal-text mt-4 rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4 text-sm">
            {generatedCitation}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(generatedCitation);
                setCopiedCite(true);
                setTimeout(() => setCopiedCite(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B162C] px-4 py-2 text-xs font-bold text-[#E6C97E]"
            >
              {copiedCite ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedCite ? "تم النسخ" : "نسخ الاستشهاد القانوني"}
            </button>
            <button
              type="button"
              onClick={() => exportTextFile(`yemen-law-article-${citeArtId}.txt`, generatedCitation)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C6A253] px-4 py-2 text-xs font-bold text-[#0B162C]"
            >
              <Download className="h-4 w-4" />
              تصدير كملف نصي (.txt)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C6A253] px-4 py-2 text-xs font-bold text-[#0B162C]"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </button>
          </div>
        </div>
      )}

      {/* 8. Legal Notes */}
      {activeTab === "notes" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة تنظيم الملاحظات القانونية الخاصة</h2>
          {!isLoggedIn ? (
            <p className="mt-3 text-xs text-[#1E2430]/75">
              يرجى <Link href="/login" className="font-bold text-[#8C6D2E] underline">تسجيل الدخول</Link> لحفظ ملاحظاتك القانونية في قاعدة البيانات.
            </p>
          ) : (
            <>
              <form onSubmit={addNote} className="mt-4 space-y-3">
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="عنوان الملاحظة القانونية..."
                  className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-4 py-2.5 text-sm"
                />
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="اكتب تحليلك أو مذكرتك القانونية..."
                  className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-sm"
                />
                <button type="submit" className="rounded-xl bg-[#0B162C] px-5 py-2.5 text-xs font-bold text-[#E6C97E]">
                  حفظ الملاحظة
                </button>
                {noteMsg && <p className="text-xs font-semibold text-emerald-700">{noteMsg}</p>}
              </form>
              <div className="mt-6 space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4">
                    <div className="text-sm font-bold text-[#0B162C]">{n.title}</div>
                    <p className="mt-1 text-xs text-[#1E2430]/80">{n.content}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 6. Reading Lists */}
      {activeTab === "lists" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#0B162C]">أداة إنشاء قوائم المراجع القانونية</h2>
          {!isLoggedIn ? (
            <p className="mt-3 text-xs text-[#1E2430]/75">
              يرجى <Link href="/login" className="font-bold text-[#8C6D2E] underline">تسجيل الدخول</Link> لإنشاء قوائم المراجع.
            </p>
          ) : (
            <>
              <form onSubmit={addReadingList} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  required
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  placeholder="اسم قائمة المراجع (مثال: مراجع دعوى فسخ عقد)..."
                  className="flex-1 rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-4 py-2 text-sm"
                />
                <input
                  type="text"
                  value={listDesc}
                  onChange={(e) => setListDesc(e.target.value)}
                  placeholder="وصف مختصر..."
                  className="flex-1 rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-4 py-2 text-sm"
                />
                <button type="submit" className="rounded-xl bg-[#0B162C] px-5 py-2 text-xs font-bold text-[#E6C97E]">
                  إنشاء القائمة
                </button>
              </form>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {lists.map((l) => (
                  <div key={l.id} className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4">
                    <div className="text-sm font-bold text-[#0B162C]">{l.title}</div>
                    <p className="mt-1 text-xs text-[#1E2430]/70">{l.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 5, 9, 12. Quick Access & Related */}
      {activeTab === "recent" && (
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#0B162C]">الوصول السريع للمواد والمفضلة</h2>
            <Link
              href="/favorites"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B162C] px-4 py-2 text-xs font-bold text-[#E6C97E]"
            >
              <Bookmark className="h-4 w-4" />
              فتح صفحة المفضلة
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {articles.slice(0, 8).map((a) => (
              <Link
                key={a.id}
                href={`/articles/${a.id}`}
                className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4 transition hover:border-[#C6A253]"
              >
                <div className="text-xs font-bold text-[#8C6D2E]">{a.article_number} — {a.law_title}</div>
                <div className="mt-1 text-xs text-[#0B162C]">{a.title || a.content.slice(0, 70)}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
