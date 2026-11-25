import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Bookmark, StickyNote, UserCheck } from "lucide-react";
import { getCurrentUser, ROLE_LABELS_AR, ROLE_PERMISSIONS } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const bookmarksCount = (
    db.prepare("SELECT COUNT(*) as c FROM bookmarks WHERE user_id = ?").get(user.id) as { c: number }
  ).c;
  const notesCount = (
    db.prepare("SELECT COUNT(*) as c FROM notes WHERE user_id = ?").get(user.id) as { c: number }
  ).c;

  const perms = ROLE_PERMISSIONS[user.role] || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C6A253]/20 px-3 py-1 text-xs font-bold text-[#E6C97E]">
              <UserCheck className="h-3.5 w-3.5" />
              {ROLE_LABELS_AR[user.role]}
            </span>
            <h1 className="mt-3 text-3xl font-bold">{user.name}</h1>
            <p className="mt-1 text-xs text-[#FAF8F4]/75" dir="ltr">{user.email}</p>
            {user.title && <p className="mt-1 text-xs text-[#D6B978]">{user.title}</p>}
          </div>
          {(user.role === "admin" || user.role === "editor") && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C6A253] px-5 py-2.5 text-xs font-bold text-[#0B162C]"
            >
              <ShieldCheck className="h-4 w-4" />
              فتح لوحة التحكم الإدارية
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link href="/favorites" className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 hover:border-[#C6A253]">
          <Bookmark className="h-6 w-6 text-[#8C6D2E]" />
          <div className="mt-3 text-2xl font-bold text-[#0B162C]">{bookmarksCount}</div>
          <div className="text-xs text-[#1E2430]/75">المواد والتشريعات المحفوظة في المفضلة</div>
        </Link>
        <Link href="/tools" className="rounded-2xl border border-[#C6A253]/30 bg-white p-6 hover:border-[#C6A253]">
          <StickyNote className="h-6 w-6 text-[#8C6D2E]" />
          <div className="mt-3 text-2xl font-bold text-[#0B162C]">{notesCount}</div>
          <div className="text-xs text-[#1E2430]/75">الملاحظات القانونية الخاصة</div>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-[#C6A253]/30 bg-white p-6">
        <h2 className="text-base font-bold text-[#0B162C]">الصلاحيات المفعّلة على الخادم لدورك ({ROLE_LABELS_AR[user.role]}):</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {perms.map((p) => (
            <span key={p} dir="ltr" className="rounded-lg bg-[#F3EFE6] px-3 py-1 font-mono text-xs text-[#0B162C]">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
