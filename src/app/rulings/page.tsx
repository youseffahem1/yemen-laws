import React from "react";
import Link from "next/link";
import { Gavel, ExternalLink, ShieldCheck } from "lucide-react";
import { getJudicialRulings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function RulingsPage({
  searchParams,
}: {
  searchParams: Promise<{ caseType?: string }>;
}) {
  const { caseType } = await searchParams;
  const rulings = getJudicialRulings(caseType);
  const caseTypes = ["الكل", "مدني", "جزائي", "إجراءات جزائية", "تجاري", "أحوال شخصية", "إداري"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <Gavel className="h-4 w-4" />
          <span>الأحكام والمبادئ القضائية اليمنية</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">مبادئ وأحكام المحكمة العليا للجمهورية اليمنية</h1>
        <p className="mt-3 max-w-3xl text-sm text-[#FAF8F4]/75">
          تُعرض في هذا القسم المبادئ القضائية المستخلصة من إصدارات المكتب الفني للمحكمة العليا ومجلة البحوث القضائية
          بمصادرها الموثقة دون اختلاق أي أحكام أو أرقام قضايا غير محققة.
        </p>
      </div>

      {/* Case Type Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {caseTypes.map((ct) => {
          const active = (!caseType && ct === "الكل") || caseType === ct;
          return (
            <Link
              key={ct}
              href={ct === "الكل" ? "/rulings" : `/rulings?caseType=${encodeURIComponent(ct)}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#0B162C] text-[#E6C97E]"
                  : "border border-[#C6A253]/35 bg-white text-[#0B162C] hover:border-[#C6A253]"
              }`}
            >
              {ct}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {rulings.map((r) => (
          <article
            key={String(r.id)}
            className="flex flex-col justify-between rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-[#8C6D2E]">
                  {String(r.court)} — {String(r.chamber)}
                </span>
                <span className="rounded-full bg-[#0B162C] px-3 py-0.5 text-[11px] font-semibold text-[#E6C97E]">
                  {String(r.case_type)}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-[#0B162C]">{String(r.dispute_subject)}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/75">{String(r.summary)}</p>

              <div className="mt-4 rounded-xl border-r-4 border-[#C6A253] bg-[#FAF8F4] p-4">
                <div className="text-[11px] font-bold text-[#8C6D2E]">المبدأ القضائي المستخلص:</div>
                <p className="legal-text mt-1 text-sm text-[#0B162C]">{String(r.principle)}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#C6A253]/20 pt-3 text-[11px] text-[#1E2430]/70">
              <span className="inline-flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                {String(r.verification_status)}
              </span>
              <div className="flex items-center gap-2">
                <span>{String(r.source)}</span>
                {r.source_url ? (
                  <a
                    href={String(r.source_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#8C6D2E] hover:underline"
                  >
                    المصدر <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
