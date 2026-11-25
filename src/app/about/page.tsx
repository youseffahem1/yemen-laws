import React from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ShieldCheck, Code2, Scale, BookCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4] sm:p-12">
        <BrandLogo variant="ar" theme="dark" size="lg" />
        <h1 className="mt-6 text-3xl font-bold">عن الموسوعة القانونية والقضائية اليمنية</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#FAF8F4]/80">
          مشروع رقمي قانوني متكامل يهدف إلى بناء مرجع تشريعي وقضائي موثوق يجمع الدستور اليمني،
          والقوانين النافذة والمعدلة، والمبادئ القضائية الصادرة عن المحكمة العليا، في بيئة بحثية
          متطورة تخدم القضاة وأعضاء النيابة العامة والمحامين والباحثين وطلاب كليات الشريعة والقانون.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <Scale className="h-6 w-6 text-[#8C6D2E]" />
          <h2 className="mt-3 text-base font-bold text-[#0B162C]">الدقة والموثوقية</h2>
          <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">
            الالتزام الصارم بعدم اختلاق أي مادة أو رقم قانوني أو حكم قضائي، والاعتماد على النصوص الرسمية وتوثيق مصادرها وتواريخ مراجعتها.
          </p>
        </div>
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <BookCheck className="h-6 w-6 text-[#8C6D2E]" />
          <h2 className="mt-3 text-base font-bold text-[#0B162C]">الفصل بين النص والشرح</h2>
          <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">
            الحفاظ على النص التشريعي الأصلي كما صدر دون تحريف، مع فصل التعديلات والشروحات والملخصات في حقول مستقلة.
          </p>
        </div>
        <div className="rounded-2xl border border-[#C6A253]/30 bg-white p-6">
          <ShieldCheck className="h-6 w-6 text-[#8C6D2E]" />
          <h2 className="mt-3 text-base font-bold text-[#0B162C]">الحوكمة والصلاحيات</h2>
          <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">
            نظام صلاحيات متعدد الأدوار مع سجل نشاطات (Audit Log) يوثق كل إضافة أو تعديل أو حذف في قاعدة البيانات.
          </p>
        </div>
      </div>

      {/* Developer Profile */}
      <div className="mt-10 rounded-2xl border border-[#C6A253]/40 bg-[#F3EFE6] p-8">
        <div className="flex items-center gap-3 text-xs font-bold text-[#8C6D2E]">
          <Code2 className="h-5 w-5" />
          <span>التعريف بمطور المنصة</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold text-[#0B162C]">يوسف الحيافي — Yousef Al-Hayafi</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#1E2430]/85">
          مطور برمجيات ومصمم أنظمة رقمية متخصصة، عمل على تصميم وبناء البنية التقنية والهوية البصرية
          والنظام التشريعي للموسوعة القانونية والقضائية اليمنية لتكون منصة حديثة تليق بالعدالة والبحث القانوني في اليمن.
        </p>
      </div>
    </div>
  );
}
