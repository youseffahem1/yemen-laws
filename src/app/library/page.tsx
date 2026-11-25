import React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { getCategoriesWithCounts, getLaws } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function LibraryPage() {
  const categories = getCategoriesWithCounts();
  const laws = getLaws();

  const officialPortals = [
    { name: "مجلس النواب اليمني", url: "https://www.parliament.gov.ye", desc: "الجهة التشريعية ونصوص الدستور والقوانين الصادرة." },
    { name: "وزارة العدل وحقوق الإنسان", url: "https://www.moj.gov.ye", desc: "بوابة وزارة العدل والتشريعات والأنظمة العدلية." },
    { name: "النيابة العامة للجمهورية اليمنية", url: "https://www.agoye.gov.ye", desc: "بوابة النيابة العامة ومكتبة القوانين الجزائية والمدنية." },
    { name: "المحكمة العليا للجمهورية اليمنية", url: "https://www.ysc.org.ye", desc: "إصدارات المكتب الفني ومجموعات القواعد والمبادئ القضائية." },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <BookOpen className="h-4 w-4" />
          <span>المكتبة القانونية اليمنية</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">الفهرس الشامل للمراجع والتشريعات</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#FAF8F4]/75">
          تضم المكتبة {categories.length} تصنيفاً تشريعياً و{laws.length} تشريعات رئيسية موثقة، بالإضافة إلى روابط البوابات القضائية والتشريعية الرسمية.
        </p>
      </div>

      <h2 className="mb-4 text-xl font-bold text-[#0B162C]">المصادر والبوابات الرسمية المعتمدة</h2>
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {officialPortals.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#C6A253]/30 bg-white p-5 transition hover:border-[#C6A253] hover:shadow-md"
          >
            <div className="flex items-center justify-between text-sm font-bold text-[#0B162C]">
              <span>{p.name}</span>
              <ExternalLink className="h-4 w-4 text-[#8C6D2E]" />
            </div>
            <p className="mt-2 text-xs text-[#1E2430]/75">{p.desc}</p>
          </a>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-bold text-[#0B162C]">التشريعات المدرجة حسب التصنيف</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="flex items-center justify-between rounded-xl border border-[#C6A253]/25 bg-white p-4 hover:border-[#C6A253]"
          >
            <div>
              <div className="text-sm font-bold text-[#0B162C]">{cat.name_ar}</div>
              <div className="text-[11px] text-[#1E2430]/65">{cat.name_en}</div>
            </div>
            <span className="rounded-full bg-[#F3EFE6] px-3 py-1 text-xs font-bold text-[#8C6D2E]">
              {cat.laws_count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
