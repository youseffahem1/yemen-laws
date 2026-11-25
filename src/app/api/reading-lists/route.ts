import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مسجل الدخول." }, { status: 401 });

  const db = getDb();
  const lists = db
    .prepare("SELECT * FROM reading_lists WHERE user_id = ? ORDER BY created_at DESC")
    .all(user.id) as Record<string, unknown>[];

  for (const list of lists) {
    list.items = db
      .prepare("SELECT * FROM reading_list_items WHERE list_id = ?")
      .all(list.id as number);
  }
  return NextResponse.json({ lists });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "personal:save")) {
    return NextResponse.json({ error: "يجب تسجيل الدخول لإنشاء قوائم المراجع." }, { status: 403 });
  }

  const { title, description, item_type, item_id, list_id, note } = await request.json();
  const db = getDb();

  if (list_id && item_type && item_id) {
    const owned = db
      .prepare("SELECT id FROM reading_lists WHERE id = ? AND user_id = ?")
      .get(Number(list_id), user.id);
    if (!owned) return NextResponse.json({ error: "القائمة غير موجودة." }, { status: 404 });

    db.prepare("INSERT INTO reading_list_items (list_id, item_type, item_id, note) VALUES (?, ?, ?, ?)").run(
      Number(list_id),
      item_type,
      Number(item_id),
      note || ""
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (!title) return NextResponse.json({ error: "يرجى إدخال عنوان القائمة." }, { status: 400 });
  const res = db
    .prepare("INSERT INTO reading_lists (user_id, title, description) VALUES (?, ?, ?)")
    .run(user.id, title, description || "");

  return NextResponse.json({ id: Number(res.lastInsertRowid) }, { status: 201 });
}
