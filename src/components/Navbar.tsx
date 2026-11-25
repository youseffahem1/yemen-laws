"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Scale,
  BookOpen,
  Gavel,
  Wrench,
  Newspaper,
  ShieldCheck,
  User,
  Menu,
  X,
  LogOut,
  Bookmark,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import type { SessionUser } from "@/lib/roles";
import { ROLE_LABELS_AR } from "@/lib/roles";

export function Navbar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/encyclopedia", label: "الموسوعة التشريعية", icon: BookOpen },
    { href: "/constitution", label: "الدستور", icon: Scale },
    { href: "/categories", label: "التصنيفات", icon: BookOpen },
    { href: "/rulings", label: "الأحكام والمبادئ", icon: Gavel },
    { href: "/tools", label: "الأدوات القانونية", icon: Wrench },
    { href: "/news", label: "الأخبار والدراسات", icon: Newspaper },
    { href: "/search", label: "البحث المتقدم", icon: Search },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#C6A253]/25 bg-[#0B162C]/95 text-[#FAF8F4] backdrop-blur-md">
      {/* Subtle top Yemen national hairline */}
      <div className="flex h-0.5 w-full">
        <div className="w-1/3 bg-[#B8292F]" />
        <div className="w-1/3 bg-[#FAF8F4]" />
        <div className="w-1/3 bg-[#151821]" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrandLogo variant="ar" theme="dark" size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-[#C6A253]/20 text-[#E6C97E]"
                    : "text-[#FAF8F4]/85 hover:bg-white/5 hover:text-[#E6C97E]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Admin Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {(user.role === "admin" || user.role === "editor") && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#C6A253]/40 bg-[#C6A253]/15 px-3 py-1.5 text-xs font-semibold text-[#E6C97E] transition hover:bg-[#C6A253]/25"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  لوحة الإدارة
                </Link>
              )}
              <Link
                href="/favorites"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-[#FAF8F4]/80 hover:bg-white/5 hover:text-[#E6C97E]"
                title="المفضلة"
              >
                <Bookmark className="h-4 w-4" />
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:border-[#C6A253]/40"
              >
                <User className="h-3.5 w-3.5 text-[#E6C97E]" />
                <span>{user.name}</span>
                <span className="rounded bg-[#C6A253]/20 px-1.5 py-0.5 text-[10px] text-[#E6C97E]">
                  {ROLE_LABELS_AR[user.role]}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-[#FAF8F4]/70 hover:bg-white/10 hover:text-red-300"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#FAF8F4]/90 hover:text-[#E6C97E]"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#C6A253] px-3.5 py-1.5 text-xs font-bold text-[#0B162C] transition hover:bg-[#E6C97E]"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-white/15 p-2 text-[#FAF8F4] lg:hidden"
          aria-label="القائمة"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0B162C] px-4 py-4 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-medium text-[#FAF8F4]"
                >
                  <Icon className="h-4 w-4 text-[#C6A253]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-xs font-medium"
                >
                  {user.name} ({ROLE_LABELS_AR[user.role]})
                </Link>
                {(user.role === "admin" || user.role === "editor") && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg bg-[#C6A253] px-3 py-2 text-xs font-bold text-[#0B162C]"
                  >
                    لوحة الإدارة
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-red-400/40 px-3 py-2 text-xs text-red-300"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-xs"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-[#C6A253] px-3 py-2 text-center text-xs font-bold text-[#0B162C]"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
