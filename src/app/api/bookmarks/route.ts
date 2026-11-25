import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مسجل الدخول." }, { status: 401 });

  const db = getDb();
  const bookmarks = db
    .prepare(
      `SELECT b.*, a.article_number, a.title as article_title, a.content as article_content,
        l.title as law_title, l.slug as law_slug
       FROM bookmarks b
       LEFT JOIN articles a ON b.item_type = 'article' AND b.item_id = a.id
       LEFT JOIN laws l ON (b.item_type = 'law' AND b.item_id = l.id) OR (b.item_type = 'article' AND a.law_id = l.id)
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`
    )
    .all(user.id);

  return NextResponse.json({ bookmarks });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "personal:save")) {
    return NextResponse.json({ error: "يجب تسجيل الدخول بحساب عضو لحفظ المفضلة." }, { status: 403 });
  }

  const { item_type, item_id } = await request.json();
  if (!item_type || !item_id) {
    return NextResponse.json({ error: "بيانات غير مكتملة." }, { status: 400 });
  }

  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?")
    .get(user.id, item_type, Number(item_id)) as { id: number } | undefined;

  if (existing) {
    db.prepare("DELETE FROM bookmarks WHERE id = ?").run(existing.id);
    return NextResponse.json({ bookmarked: false });
  }

  db.prepare("INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)").run(
    user.id,
    item_type,
    Number(item_id)
  );
  return NextResponse.json({ bookmarked: true });
}
