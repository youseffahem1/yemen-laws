import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "audit:view")) {
    return NextResponse.json({ error: "غير مصرح لك بالاطلاع على سجل النشاطات." }, { status: 403 });
  }

  const db = getDb();
  const logs = db.prepare("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100").all();
  return NextResponse.json({ logs });
}
