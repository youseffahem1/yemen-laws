import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { createSessionToken, hashPassword, SESSION_COOKIE_NAME, type UserRole } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const ALLOWED_SELF_ROLES: UserRole[] = ["lawyer", "judge", "researcher", "student", "visitor"];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح لطلبات التسجيل. يرجى المحاولة لاحقاً." },
        { status: 429 }
      );
    }
    const { name, email, password, role, title, syndicate_id } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "يرجى استكمال الاسم والبريد الإلكتروني وكلمة المرور." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return NextResponse.json({ error: "يجب أن لا تقل كلمة المرور عن 6 أحرف." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const selectedRole: UserRole = ALLOWED_SELF_ROLES.includes(role) ? role : "researcher";

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: "البريد الإلكتروني مسجل مسبقاً." }, { status: 409 });
    }

    const passwordHash = await hashPassword(String(password));
    const res = db
      .prepare(
        `INSERT INTO users (name, email, password_hash, role, status, title, syndicate_id)
         VALUES (?, ?, ?, ?, 'active', ?, ?)`
      )
      .run(String(name).trim(), cleanEmail, passwordHash, selectedRole, title || "", syndicate_id || "");

    const userId = Number(res.lastInsertRowid);
    const token = await createSessionToken({
      id: userId,
      name: String(name).trim(),
      email: cleanEmail,
      role: selectedRole,
      status: "active",
      title: title || "",
    });

    logAudit({
      userId,
      userName: String(name).trim(),
      userRole: selectedRole,
      action: "REGISTER",
      entityType: "user",
      entityId: userId,
      entityTitle: cleanEmail,
    });

    const response = NextResponse.json(
      { user: { id: userId, name: String(name).trim(), email: cleanEmail, role: selectedRole } },
      { status: 201 }
    );
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء الحساب." }, { status: 500 });
  }
}
