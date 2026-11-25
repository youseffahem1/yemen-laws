import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "laws:edit")) {
    return NextResponse.json({ error: "غير مصرح لك بتعديل التشريعات." }, { status: 403 });
  }

  const { id } = await params;
  const lawId = Number(id);
  const body = await request.json();
  const db = getDb();

  const existing = db.prepare("SELECT id, title FROM laws WHERE id = ?").get(lawId) as { id: number; title: string } | undefined;
  if (!existing) {
    return NextResponse.json({ error: "التشريع غير موجود." }, { status: 404 });
  }

  db.prepare(
    `UPDATE laws SET
      title = COALESCE(?, title),
      status = COALESCE(?, status),
      official_source = COALESCE(?, official_source),
      verification_status = COALESCE(?, verification_status),
      summary = COALESCE(?, summary),
      last_reviewed_at = date('now')
     WHERE id = ?`
  ).run(
    body.title ?? null,
    body.status ?? null,
    body.official_source ?? null,
    body.verification_status ?? null,
    body.summary ?? null,
    lawId
  );

  logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: "UPDATE",
    entityType: "law",
    entityId: lawId,
    entityTitle: body.title || existing.title,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "laws:delete")) {
    return NextResponse.json({ error: "صلاحية الحذف محصورة بمدير النظام فقط." }, { status: 403 });
  }

  const { id } = await params;
  const lawId = Number(id);
  const db = getDb();
  const existing = db.prepare("SELECT id, title FROM laws WHERE id = ?").get(lawId) as { id: number; title: string } | undefined;
  if (!existing) {
    return NextResponse.json({ error: "التشريع غير موجود." }, { status: 404 });
  }

  db.prepare("DELETE FROM articles_fts WHERE law_id = ?").run(lawId);
  db.prepare("DELETE FROM laws WHERE id = ?").run(lawId);

  logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: "DELETE",
    entityType: "law",
    entityId: lawId,
    entityTitle: existing.title,
  });

  return NextResponse.json({ ok: true });
}
