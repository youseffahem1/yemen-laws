import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME, verifyPassword, type UserRole } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح لمحاولات الدخول. يرجى المحاولة بعد 15 دقيقة." },
        { status: 429 }
      );
    }
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." }, { status: 400 });
    }

    const db = getDb();
    const user = db
      .prepare("SELECT id, name, email, password_hash, role, status, title FROM users WHERE email = ?")
      .get(String(email).trim().toLowerCase()) as
      | { id: number; name: string; email: string; password_hash: string; role: UserRole; status: string; title: string }
      | undefined;

    if (!user) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "هذا الحساب معطل أو قيد المراجعة الإدارية." }, { status: 403 });
    }

    const ok = await verifyPassword(String(password), user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      title: user.title,
    });

    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "LOGIN",
      entityType: "user",
      entityId: user.id,
      entityTitle: user.email,
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول." }, { status: 500 });
  }
}
