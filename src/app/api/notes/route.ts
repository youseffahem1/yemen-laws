import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مسجل الدخول." }, { status: 401 });

  const db = getDb();
  const notes = db
    .prepare(
      `SELECT n.*, a.article_number, l.title as law_title
       FROM notes n
       LEFT JOIN articles a ON n.article_id = a.id
       LEFT JOIN laws l ON n.law_id = l.id
       WHERE n.user_id = ?
       ORDER BY n.updated_at DESC`
    )
    .all(user.id);

  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "personal:save")) {
    return NextResponse.json({ error: "يجب تسجيل الدخول لحفظ الملاحظات القانونية." }, { status: 403 });
  }

  const { title, content, article_id, law_id } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: "يرجى إدخال عنوان ومحتوى الملاحظة." }, { status: 400 });
  }

  const db = getDb();
  const res = db
    .prepare("INSERT INTO notes (user_id, article_id, law_id, title, content) VALUES (?, ?, ?, ?, ?)")
    .run(user.id, article_id || null, law_id || null, title, content);

  return NextResponse.json({ id: Number(res.lastInsertRowid) }, { status: 201 });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مسجل الدخول." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const db = getDb();
  db.prepare("DELETE FROM notes WHERE id = ? AND user_id = ?").run(id, user.id);
  return NextResponse.json({ ok: true });
}
