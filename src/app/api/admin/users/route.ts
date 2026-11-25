import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission, type UserRole } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "غير مصرح لك بإدارة المستخدمين." }, { status: 403 });
  }

  const db = getDb();
  const users = db
    .prepare("SELECT id, name, email, role, status, title, syndicate_id, created_at FROM users ORDER BY id ASC")
    .all();

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "غير مصرح لك بتعديل صلاحيات المستخدمين." }, { status: 403 });
  }

  const { targetUserId, role, status } = await request.json();
  if (!targetUserId) return NextResponse.json({ error: "معرف المستخدم مطلوب." }, { status: 400 });

  const db = getDb();
  const target = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(Number(targetUserId)) as
    | { id: number; name: string; email: string }
    | undefined;
  if (!target) return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });

  const validRoles: UserRole[] = ["admin", "editor", "lawyer", "judge", "researcher", "student", "visitor"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: "الدور غير صالح." }, { status: 400 });
  }

  db.prepare(
    "UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?"
  ).run(role ?? null, status ?? null, Number(targetUserId));

  logAudit({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: "UPDATE_USER",
    entityType: "user",
    entityId: target.id,
    entityTitle: target.email,
    details: `role=${role ?? "unchanged"}, status=${status ?? "unchanged"}`,
  });

  return NextResponse.json({ ok: true });
}
