import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bookmark, StickyNote } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = getDb();
  const bookmarks = db
    .prepare(
      `SELECT b.id, b.item_type, b.item_id, b.created_at,
        a.article_number, a.title as article_title, a.content as article_content,
        l.title as law_title, l.slug as law_slug
       FROM bookmarks b
       LEFT JOIN articles a ON b.item_type = 'article' AND b.item_id = a.id
       LEFT JOIN laws l ON (b.item_type = 'law' AND b.item_id = l.id) OR (b.item_type = 'article' AND a.law_id = l.id)
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`
    )
    .all(user.id) as Record<string, unknown>[];

  const notes = db
    .prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC")
    .all(user.id) as Record<string, unknown>[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <Bookmark className="h-4 w-4" />
          <span>مساحة العمل القانونية الشخصية</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">المفضلة والملاحظات الخاصة</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0B162C]">
            <Bookmark className="h-5 w-5 text-[#8C6D2E]" />
            المواد والتشريعات المحفوظة ({bookmarks.length})
          </h2>
          {bookmarks.length === 0 ? (
            <div className="rounded-xl border border-[#C6A253]/25 bg-white p-6 text-xs text-[#1E2430]/70">
              لم تقم بحفظ أي مادة بعد. يمكنك حفظ أي مادة من صفحة عارض المادة.
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b) => (
                <Link
                  key={String(b.id)}
                  href={b.item_type === "article" ? `/articles/${String(b.item_id)}` : `/laws/${String(b.law_slug)}`}
                  className="block rounded-xl border border-[#C6A253]/30 bg-white p-4 hover:border-[#C6A253]"
                >
                  <div className="text-xs font-bold text-[#8C6D2E]">
                    {String(b.law_title)} {b.article_number ? `— ${String(b.article_number)}` : ""}
                  </div>
                  {b.article_title ? (
                    <div className="mt-1 text-sm font-bold text-[#0B162C]">{String(b.article_title)}</div>
                  ) : null}
                  {b.article_content ? (
                    <p className="mt-1 line-clamp-2 text-xs text-[#1E2430]/75">{String(b.article_content)}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0B162C]">
            <StickyNote className="h-5 w-5 text-[#8C6D2E]" />
            الملاحظات القانونية ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <div className="rounded-xl border border-[#C6A253]/25 bg-white p-6 text-xs text-[#1E2430]/70">
              لا توجد ملاحظات مسجلة. أضف ملاحظاتك من{" "}
              <Link href="/tools" className="font-bold text-[#8C6D2E] underline">مركز الأدوات القانونية</Link>.
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={String(n.id)} className="rounded-xl border border-[#C6A253]/30 bg-white p-4">
                  <div className="text-sm font-bold text-[#0B162C]">{String(n.title)}</div>
                  <p className="mt-1 text-xs text-[#1E2430]/80">{String(n.content)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
