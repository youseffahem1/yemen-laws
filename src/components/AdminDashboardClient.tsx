"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  BookOpen,
  Gavel,
  Newspaper,
  Users,
  History,
  Trash2,
  PlusCircle,
  Upload,
} from "lucide-react";
import type { UserRole } from "@/lib/roles";
import { ROLE_LABELS_AR } from "@/lib/roles";

interface AdminProps {
  currentUserRole: UserRole;
  initialTab?: "overview" | "laws" | "rulings" | "content" | "users" | "audit";
  stats: {
    lawsCount: number;
    articlesCount: number;
    rulingsCount: number;
    usersCount: number;
    searchesCount: number;
  };
  categories: { id: number; name_ar: string }[];
  laws: { id: number; slug: string; title: string; law_number: string; issue_year: number; status: string; views_count: number; articles_count?: number }[];
  rulings: { id: number; court: string; chamber: string; case_type: string; dispute_subject: string }[];
  users: { id: number; name: string; email: string; role: UserRole; status: string; title: string | null }[];
  auditLogs: { id: number; user_name: string; user_role: string; action: string; entity_type: string; entity_title: string | null; created_at: string }[];
}

export function AdminDashboardClient({
  currentUserRole,
  initialTab = "overview",
  stats,
  categories,
  laws,
  rulings,
  users,
  auditLogs,
}: AdminProps) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Add Law Form
  const [lawTitle, setLawTitle] = useState("");
  const [lawNum, setLawNum] = useState("");
  const [lawYear, setLawYear] = useState("2026");
  const [lawAuthority, setLawAuthority] = useState("مجلس النواب / رئيس الجمهورية");
  const [lawCatId, setLawCatId] = useState(String(categories[0]?.id || 1));
  const [lawSource, setLawSource] = useState("الجريدة الرسمية للجمهورية اليمنية");
  const [lawPdfUrl, setLawPdfUrl] = useState("");
  const [lawSummary, setLawSummary] = useState("");

  // Add Article Form
  const [artLawId, setArtLawId] = useState(String(laws[0]?.id || ""));
  const [artNum, setArtNum] = useState("");
  const [artTitle, setArtTitle] = useState("");
  const [artContent, setArtContent] = useState("");

  // Add Ruling Form
  const [rCourt, setRCourt] = useState("المحكمة العليا للجمهورية اليمنية");
  const [rChamber, setRChamber] = useState("الدائرة المدنية");
  const [rType, setRType] = useState("مدني");
  const [rSubject, setRSubject] = useState("");
  const [rSummary, setRSummary] = useState("");
  const [rPrinciple, setRPrinciple] = useState("");
  const [rSource, setRSource] = useState("المكتب الفني للمحكمة العليا");

  // Add News Form
  const [nTitle, setNTitle] = useState("");
  const [nKind, setNKind] = useState("news");
  const [nSummary, setNSummary] = useState("");
  const [nContent, setNContent] = useState("");
  const [nSource, setNSource] = useState("الموسوعة القانونية والقضائية اليمنية");

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setMsg("جاري رفع ملف PDF...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (!res.ok) {
      setErr(d.error || "فشل رفع الملف.");
      setMsg("");
      return;
    }
    setLawPdfUrl(d.url);
    setMsg(`تم رفع الملف بنجاح: ${d.filename}`);
  }

  async function submitLaw(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/laws", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lawTitle,
        law_number: lawNum,
        issue_year: Number(lawYear),
        issuing_authority: lawAuthority,
        category_id: Number(lawCatId),
        official_source: lawSource,
        pdf_url: lawPdfUrl || null,
        summary: lawSummary,
      }),
    });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر إضافة القانون.");
    setMsg("تمت إضافة التشريع بنجاح وتسجيله في سجل النشاطات.");
    setLawTitle("");
    setLawNum("");
    setLawSummary("");
    router.refresh();
  }

  async function deleteLaw(id: number) {
    setErr("");
    const res = await fetch(`/api/laws/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر الحذف.");
    setMsg("تم حذف التشريع بنجاح.");
    router.refresh();
  }

  async function submitArticle(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        law_id: Number(artLawId),
        article_number: artNum,
        title: artTitle,
        content: artContent,
      }),
    });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر إضافة المادة.");
    setMsg("تمت إضافة المادة القانونية وفهرستها في محرك البحث.");
    setArtNum("");
    setArtTitle("");
    setArtContent("");
    router.refresh();
  }

  async function submitRuling(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/rulings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        court: rCourt,
        chamber: rChamber,
        case_type: rType,
        dispute_subject: rSubject,
        summary: rSummary,
        principle: rPrinciple,
        source: rSource,
      }),
    });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر إضافة الحكم.");
    setMsg("تمت إضافة المبدأ القضائي بنجاح.");
    setRSubject("");
    setRSummary("");
    setRPrinciple("");
    router.refresh();
  }

  async function submitNews(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: nTitle,
        kind: nKind,
        summary: nSummary,
        content: nContent,
        source_name: nSource,
      }),
    });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر نشر المحتوى.");
    setMsg("تم نشر الخبر/المقال بنجاح.");
    setNTitle("");
    setNSummary("");
    setNContent("");
    router.refresh();
  }

  async function updateUser(targetUserId: number, role?: UserRole, status?: string) {
    setErr("");
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, role, status }),
    });
    const d = await res.json();
    if (!res.ok) return setErr(d.error || "تعذر تحديث المستخدم.");
    setMsg("تم تحديث بيانات المستخدم وصلاحياته.");
    router.refresh();
  }

  const navTabs = [
    { id: "overview", label: "الإحصائيات العامة", icon: ShieldCheck },
    { id: "laws", label: "إدارة القوانين والمواد", icon: BookOpen },
    { id: "rulings", label: "إدارة الأحكام والمبادئ", icon: Gavel },
    { id: "content", label: "إدارة الأخبار والمقالات", icon: Newspaper },
    ...(currentUserRole === "admin" ? [{ id: "users" as const, label: "إدارة المستخدمين", icon: Users }] : []),
    { id: "audit", label: "سجل النشاطات (Audit Log)", icon: History },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {navTabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                tab === t.id
                  ? "bg-[#0B162C] text-[#E6C97E]"
                  : "border border-[#C6A253]/30 bg-white text-[#0B162C] hover:border-[#C6A253]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {msg && <div className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">{msg}</div>}
      {err && <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{err}</div>}

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "القوانين الموثقة", val: stats.lawsCount },
              { label: "المواد القانونية", val: stats.articlesCount },
              { label: "المبادئ القضائية", val: stats.rulingsCount },
              { label: "المستخدمون المسجلون", val: stats.usersCount },
              { label: "عمليات البحث المسجلة", val: stats.searchesCount },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#C6A253]/30 bg-white p-5">
                <div className="text-2xl font-bold text-[#0B162C]">{s.val}</div>
                <div className="mt-1 text-xs text-[#1E2430]/70">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6">
            <h2 className="mb-4 text-base font-bold text-[#0B162C]">أكثر التشريعات زيارة</h2>
            <div className="space-y-2">
              {laws
                .slice()
                .sort((a, b) => b.views_count - a.views_count)
                .slice(0, 5)
                .map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-lg bg-[#FAF8F4] px-4 py-2.5 text-xs">
                    <span className="font-bold text-[#0B162C]">{l.title}</span>
                    <span className="text-[#8C6D2E]">{l.views_count} زيارة</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Laws Management */}
      {tab === "laws" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submitLaw} className="space-y-3 rounded-2xl border border-[#C6A253]/30 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#0B162C]">
              <PlusCircle className="h-5 w-5 text-[#8C6D2E]" />
              إضافة تشريع جديد
            </h2>
            <input required value={lawTitle} onChange={(e) => setLawTitle(e.target.value)} placeholder="اسم القانون الرسمي" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <div className="grid grid-cols-2 gap-3">
              <input required value={lawNum} onChange={(e) => setLawNum(e.target.value)} placeholder="رقم القانون" className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
              <input required type="number" value={lawYear} onChange={(e) => setLawYear(e.target.value)} placeholder="سنة الإصدار" className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            </div>
            <select value={lawCatId} onChange={(e) => setLawCatId(e.target.value)} className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_ar}</option>
              ))}
            </select>
            <input required value={lawAuthority} onChange={(e) => setLawAuthority(e.target.value)} placeholder="الجهة المصدرة" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <input required value={lawSource} onChange={(e) => setLawSource(e.target.value)} placeholder="المصدر الرسمي" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#C6A253] bg-[#FAF8F4] p-3 text-xs">
              <Upload className="h-4 w-4 text-[#8C6D2E]" />
              <span>{lawPdfUrl ? `ملف مرفق: ${lawPdfUrl}` : "رفع ملف PDF الرسمي للتشريع (اختياري)"}</span>
              <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
            </label>
            <textarea rows={3} value={lawSummary} onChange={(e) => setLawSummary(e.target.value)} placeholder="ملخص تعريفي بالتشريع" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
            <button type="submit" className="w-full rounded-xl bg-[#0B162C] py-2.5 text-xs font-bold text-[#E6C97E]">
              حفظ التشريع
            </button>
          </form>

          <form onSubmit={submitArticle} className="space-y-3 rounded-2xl border border-[#C6A253]/30 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#0B162C]">
              <PlusCircle className="h-5 w-5 text-[#8C6D2E]" />
              إضافة مادة قانونية إلى تشريع
            </h2>
            <select value={artLawId} onChange={(e) => setArtLawId(e.target.value)} className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs">
              {laws.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
            <input required value={artNum} onChange={(e) => setArtNum(e.target.value)} placeholder="رقم المادة (مثال: المادة (10))" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <input value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="عنوان المادة (اختياري)" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <textarea required rows={6} value={artContent} onChange={(e) => setArtContent(e.target.value)} placeholder="النص الكامل للمادة كما ورد في المصدر الرسمي..." className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
            <button type="submit" className="w-full rounded-xl bg-[#0B162C] py-2.5 text-xs font-bold text-[#E6C97E]">
              إضافة المادة وفهرستها
            </button>
          </form>

          <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 lg:col-span-2">
            <h3 className="mb-3 text-base font-bold text-[#0B162C]">التشريعات المسجلة ({laws.length})</h3>
            <div className="space-y-2">
              {laws.map((l) => (
                <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#C6A253]/20 bg-[#FAF8F4] px-4 py-3 text-xs">
                  <div>
                    <strong className="text-[#0B162C]">{l.title}</strong>
                    <span className="mr-2 text-[#1E2430]/70">({l.law_number} لسنة {l.issue_year})</span>
                  </div>
                  {currentUserRole === "admin" && (
                    <button
                      type="button"
                      onClick={() => deleteLaw(l.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-2.5 py-1 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rulings */}
      {tab === "rulings" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={submitRuling} className="space-y-3 rounded-2xl border border-[#C6A253]/30 bg-white p-6">
            <h2 className="text-lg font-bold text-[#0B162C]">إضافة حكم أو مبدأ قضائي موثق</h2>
            <input required value={rCourt} onChange={(e) => setRCourt(e.target.value)} placeholder="المحكمة" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <div className="grid grid-cols-2 gap-3">
              <input required value={rChamber} onChange={(e) => setRChamber(e.target.value)} placeholder="الدائرة" className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
              <input required value={rType} onChange={(e) => setRType(e.target.value)} placeholder="نوع القضية (مدني/جزائي)" className="rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            </div>
            <input required value={rSubject} onChange={(e) => setRSubject(e.target.value)} placeholder="موضوع النزاع" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <textarea required rows={3} value={rSummary} onChange={(e) => setRSummary(e.target.value)} placeholder="ملخص الحكم" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
            <textarea required rows={3} value={rPrinciple} onChange={(e) => setRPrinciple(e.target.value)} placeholder="المبدأ القضائي المستخلص" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
            <input required value={rSource} onChange={(e) => setRSource(e.target.value)} placeholder="المرجع والمصدر الرسمي" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
            <button type="submit" className="w-full rounded-xl bg-[#0B162C] py-2.5 text-xs font-bold text-[#E6C97E]">
              نشر المبدأ القضائي
            </button>
          </form>

          <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6">
            <h3 className="mb-3 text-base font-bold text-[#0B162C]">المبادئ والأحكام المسجلة ({rulings.length})</h3>
            <div className="space-y-2">
              {rulings.map((r) => (
                <div key={r.id} className="rounded-xl bg-[#FAF8F4] p-3 text-xs">
                  <div className="font-bold text-[#8C6D2E]">{r.court} — {r.chamber}</div>
                  <div className="mt-1 font-semibold text-[#0B162C]">{r.dispute_subject}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content / News */}
      {tab === "content" && (
        <form onSubmit={submitNews} className="max-w-2xl space-y-3 rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <h2 className="text-lg font-bold text-[#0B162C]">نشر خبر قانوني أو دراسة أو بحث</h2>
          <input required value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="العنوان" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
          <select value={nKind} onChange={(e) => setNKind(e.target.value)} className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs">
            <option value="news">خبر قضائي / تشريعي</option>
            <option value="legislation_update">تحديث تشريعي</option>
            <option value="research">بحث أو دراسة قانونية</option>
            <option value="article">مقال قانوني</option>
          </select>
          <input required value={nSource} onChange={(e) => setNSource(e.target.value)} placeholder="المصدر" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2 text-xs" />
          <textarea required rows={2} value={nSummary} onChange={(e) => setNSummary(e.target.value)} placeholder="ملخص مختصر" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
          <textarea required rows={5} value={nContent} onChange={(e) => setNContent(e.target.value)} placeholder="المحتوى الكامل" className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] p-3 text-xs" />
          <button type="submit" className="rounded-xl bg-[#0B162C] px-6 py-2.5 text-xs font-bold text-[#E6C97E]">
            نشر المحتوى
          </button>
        </form>
      )}

      {/* Users Management (Admin Only) */}
      {tab === "users" && currentUserRole === "admin" && (
        <div className="overflow-x-auto rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-[#0B162C]">إدارة المستخدمين والأدوار والصلاحيات</h2>
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#C6A253]/25 text-[#8C6D2E]">
                <th className="py-2">الاسم</th>
                <th className="py-2">البريد</th>
                <th className="py-2">الدور</th>
                <th className="py-2">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C6A253]/15">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-bold text-[#0B162C]">{u.name}</td>
                  <td className="py-3" dir="ltr">{u.email}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u.id, e.target.value as UserRole, undefined)}
                      className="rounded-lg border border-[#C6A253]/35 bg-[#FAF8F4] px-2 py-1"
                    >
                      {(Object.keys(ROLE_LABELS_AR) as UserRole[]).map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS_AR[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <select
                      value={u.status}
                      onChange={(e) => updateUser(u.id, undefined, e.target.value)}
                      className="rounded-lg border border-[#C6A253]/35 bg-[#FAF8F4] px-2 py-1"
                    >
                      <option value="active">مفعّل</option>
                      <option value="disabled">معطّل</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Log */}
      {tab === "audit" && (
        <div className="overflow-x-auto rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-[#0B162C]">سجل النشاطات والرقابة الإدارية (Audit Log)</h2>
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-[#C6A253]/25 text-[#8C6D2E]">
                <th className="py-2">المستخدم</th>
                <th className="py-2">الدور</th>
                <th className="py-2">الإجراء</th>
                <th className="py-2">العنصر</th>
                <th className="py-2">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C6A253]/15">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-2.5 font-bold text-[#0B162C]">{log.user_name}</td>
                  <td className="py-2.5">{log.user_role}</td>
                  <td className="py-2.5 font-mono text-[#8C6D2E]">{log.action}</td>
                  <td className="py-2.5">{log.entity_title || log.entity_type}</td>
                  <td className="py-2.5 text-[#1E2430]/70" dir="ltr">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
