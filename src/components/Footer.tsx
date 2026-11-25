import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-[#C6A253]/25 bg-[#070E1C] text-[#FAF8F4]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <BrandLogo variant="ar" theme="dark" size="sm" />
            <p className="text-xs leading-relaxed text-[#FAF8F4]/70">
              منصة قانونية وقضائية رقمية تهدف إلى توثيق وتنظيم التشريعات اليمنية والمبادئ القضائية
              من مصادرها الرسمية لخدمة القضاة والمحامين والباحثين وطلاب القانون.
            </p>
            <div className="pt-1">
              <BrandLogo variant="en" theme="dark" size="sm" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#E6C97E]">الأقسام التشريعية</h3>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/75">
              <li><Link href="/constitution" className="hover:text-[#E6C97E]">الدستور اليمني</Link></li>
              <li><Link href="/encyclopedia" className="hover:text-[#E6C97E]">الموسوعة التشريعية</Link></li>
              <li><Link href="/categories" className="hover:text-[#E6C97E]">تصنيفات القوانين (20 تصنيفاً)</Link></li>
              <li><Link href="/rulings" className="hover:text-[#E6C97E]">الأحكام والمبادئ القضائية</Link></li>
              <li><Link href="/library" className="hover:text-[#E6C97E]">المكتبة القانونية</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#E6C97E]">الأدوات والبحث</h3>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/75">
              <li><Link href="/search" className="hover:text-[#E6C97E]">محرك البحث القانوني المتقدم</Link></li>
              <li><Link href="/tools" className="hover:text-[#E6C97E]">مركز الأدوات القانونية</Link></li>
              <li><Link href="/news" className="hover:text-[#E6C97E]">الأخبار والدراسات القانونية</Link></li>
              <li><Link href="/articles" className="hover:text-[#E6C97E]">المقالات والأبحاث</Link></li>
              <li><Link href="/favorites" className="hover:text-[#E6C97E]">المفضلة والملاحظات</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-[#E6C97E]">عن المنصة والحوكمة</h3>
            <ul className="space-y-2 text-xs text-[#FAF8F4]/75">
              <li><Link href="/about" className="hover:text-[#E6C97E]">من نحن والتعريف بالمطور</Link></li>
              <li><Link href="/privacy" className="hover:text-[#E6C97E]">سياسة الخصوصية وشروط الاستخدام</Link></li>
              <li><Link href="/login" className="hover:text-[#E6C97E]">بوابة الأعضاء والصلاحيات</Link></li>
            </ul>
            <div className="mt-5 rounded-xl border border-[#C6A253]/25 bg-white/5 p-3 text-[11px] text-[#FAF8F4]/70">
              <strong className="block text-[#E6C97E]">منهجية التوثيق:</strong>
              يُحفظ النص القانوني كما ورد في مصدره الرسمي مع بيان حالة السريان والتعديلات وتاريخ المراجعة.
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#FAF8F4]/65 sm:flex-row">
          <p>© {new Date().getFullYear()} الموسوعة القانونية والقضائية اليمنية — جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-3 rounded-full border border-[#C6A253]/30 bg-[#0B162C] px-4 py-1.5">
            <span className="font-semibold text-[#E6C97E]">من تطوير يوسف الحيافي</span>
            <span className="text-white/30">|</span>
            <span dir="ltr" className="font-mono text-[11px] text-[#FAF8F4]/80">
              Developed by Yousef Al-Hayafi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
