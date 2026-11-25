"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandEmblem } from "@/components/BrandLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lawyer");
  const [title, setTitle] = useState("");
  const [syndicateId, setSyndicateId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, title, syndicate_id: syndicateId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذر إنشاء الحساب.");
        setLoading(false);
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="rounded-2xl border border-[#C6A253]/35 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <BrandEmblem size={52} />
          <h1 className="mt-4 text-2xl font-bold text-[#0B162C]">إنشاء حساب قانوني جديد</h1>
          <p className="mt-1 text-xs text-[#1E2430]/70">انضم إلى الموسوعة القانونية والقضائية اليمنية</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">الاسم الكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الثلاثي أو اللقب المهني"
              className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">الصفة القانونية</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
            >
              <option value="lawyer">محامٍ</option>
              <option value="judge">قاضٍ / عضو نيابة</option>
              <option value="researcher">باحث قانوني</option>
              <option value="student">طالب كلية الشريعة والقانون</option>
              <option value="visitor">زائر / مهتم بالشأن القانوني</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#0B162C]">المسمى المهني (اختياري)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: محامٍ أمام الاستئناف"
                className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#0B162C]">رقم القيد / البطاقة (اختياري)</label>
              <input
                type="text"
                value={syndicateId}
                onChange={(e) => setSyndicateId(e.target.value)}
                placeholder="YBA-..."
                className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              placeholder="6 أحرف على الأقل"
              className="w-full rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5 text-sm"
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0B162C] py-3 text-sm font-bold text-[#E6C97E] transition hover:bg-[#122344]"
          >
            {loading ? "جاري إنشاء الحساب..." : "تسجيل الحساب"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#1E2430]/75">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-[#8C6D2E] hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
