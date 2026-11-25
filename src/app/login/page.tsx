"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { BrandEmblem } from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذر تسجيل الدخول.");
        setLoading(false);
        return;
      }
      router.push(data.user.role === "admin" || data.user.role === "editor" ? "/admin" : "/profile");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-2xl border border-[#C6A253]/35 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <BrandEmblem size={56} />
          <h1 className="mt-4 text-2xl font-bold text-[#0B162C]">تسجيل الدخول إلى المنصة</h1>
          <p className="mt-1 text-xs text-[#1E2430]/70">بوابة الأعضاء والصلاحيات القانونية</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">البريد الإلكتروني</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5">
              <Mail className="h-4 w-4 text-[#8C6D2E]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@yemenlegal.ye"
                className="w-full bg-transparent text-sm focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#0B162C]">كلمة المرور</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#C6A253]/35 bg-[#FAF8F4] px-3 py-2.5">
              <Lock className="h-4 w-4 text-[#8C6D2E]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0B162C] py-3 text-sm font-bold text-[#E6C97E] transition hover:bg-[#122344] disabled:opacity-60"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>

        <div className="mt-6 border-t border-[#C6A253]/20 pt-4 text-center text-xs text-[#1E2430]/75">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-bold text-[#8C6D2E] hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>

        {/* Demo RBAC Quick Fill */}
        <div className="mt-6 rounded-xl border border-[#C6A253]/25 bg-[#F3EFE6] p-4 text-[11px]">
          <div className="mb-2 font-bold text-[#0B162C]">حسابات تجريبية لاختبار الصلاحيات (RBAC):</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "مدير النظام", e: "admin@yemenlegal.ye", p: "Admin@YemenLaw2026" },
              { label: "محرر قانوني", e: "editor@yemenlegal.ye", p: "YemenLaw@2026" },
              { label: "قاضٍ", e: "judge@yemenlegal.ye", p: "YemenLaw@2026" },
              { label: "محامٍ", e: "lawyer@yemenlegal.ye", p: "YemenLaw@2026" },
            ].map((acc) => (
              <button
                key={acc.e}
                type="button"
                onClick={() => {
                  setEmail(acc.e);
                  setPassword(acc.p);
                }}
                className="rounded-lg border border-[#C6A253]/40 bg-white px-2.5 py-1 font-semibold text-[#0B162C] hover:bg-[#0B162C] hover:text-[#E6C97E]"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
