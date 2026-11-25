import React from "react";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  Gavel,
  Wrench,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Newspaper,
} from "lucide-react";
import { BrandEmblem } from "@/components/BrandLogo";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import {
  getPlatformStats,
  getCategoriesWithCounts,
  getLaws,
  getJudicialRulings,
  getLegalNews,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const stats = getPlatformStats();
  const categories = getCategoriesWithCounts();
  const laws = getLaws().slice(0, 6);
  const rulings = getJudicialRulings().slice(0, 4);
  const news = getLegalNews().slice(0, 3);

  const featuredCards = [
    { title: "الدستور اليمني", desc: "الوثيقة الدستورية العليا وتعديلاتها وأحكام السلطات والحقوق.", href: "/constitution", image: "/images/hero-old-sanaa-flag.jpg", count: categories.find((c) => c.slug === "constitution")?.articles_count || 0, unit: "مادة محققة" },
    { title: "القانون المدني", desc: "القانون المدني رقم (14) لسنة 2002م والمعاملات والعقود.", href: "/categories/civil", image: "/images/yemen-manuscripts-qamariya.jpg", count: categories.find((c) => c.slug === "civil")?.articles_count || 0, unit: "مادة محققة" },
    { title: "القانون الجنائي", desc: "قانون الجرائم والعقوبات رقم (12) لسنة 1994م والحدود والتعازير.", href: "/categories/penal", image: "/images/supreme-court-hall.jpg", count: categories.find((c) => c.slug === "penal")?.articles_count || 0, unit: "مادة محققة" },
    { title: "الأحوال الشخصية", desc: "قانون الأحوال الشخصية رقم (20) لسنة 1992م وتعديلاته.", href: "/categories/personal-status", image: "/images/yemen-legal-library.jpg", count: categories.find((c) => c.slug === "personal-status")?.articles_count || 0, unit: "مادة محققة" },
    { title: "القانون التجاري", desc: "القانون التجاري رقم (32) لسنة 1991م والأعمال والأوراق التجارية.", href: "/categories/commercial", image: "/images/yemen-heritage-architecture.jpg", count: categories.find((c) => c.slug === "commercial")?.articles_count || 0, unit: "مادة محققة" },
    { title: "قانون المرافعات", desc: "قانون المرافعات والتنفيذ المدني رقم (40) لسنة 2002م.", href: "/categories/civil-procedure", image: "/images/yemen-manuscripts-qamariya.jpg", count: categories.find((c) => c.slug === "civil-procedure")?.articles_count || 0, unit: "مادة محققة" },
    { title: "قانون الإجراءات الجزائية", desc: "قانون الإجراءات الجزائية رقم (13) لسنة 1994م وضمانات المتهم.", href: "/categories/criminal-procedure", image: "/images/hero-yemen-court.jpg", count: categories.find((c) => c.slug === "criminal-procedure")?.articles_count || 0, unit: "مادة محققة" },
    { title: "السلطة القضائية", desc: "قانون السلطة القضائية رقم (1) لسنة 1991م ومجلس القضاء الأعلى.", href: "/categories/judicial-authority", image: "/images/hero-yemen-court.jpg", count: categories.find((c) => c.slug === "judicial-authority")?.laws_count || 0, unit: "تشريع موثق" },
    { title: "قانون الإثبات", desc: "قانون الإثبات رقم (21) لسنة 1992م والدعوى والبينة واليمين.", href: "/categories/evidence", image: "/images/yemen-manuscripts-qamariya.jpg", count: categories.find((c) => c.slug === "evidence")?.articles_count || 0, unit: "مادة محققة" },
    { title: "الأحكام والمبادئ القضائية", desc: "مبادئ الدائرتين المدنية والجزائية بالمحكمة العليا اليمنية.", href: "/rulings", image: "/images/supreme-court-hall.jpg", count: stats.rulingsCount, unit: "مبدأ موثق" },
    { title: "قانون العمل اليمني", desc: "قانون العمل رقم (5) لسنة 1995م وعلاقات العمل والأجور.", href: "/categories/labor", image: "/images/yemen-heritage-architecture.jpg", count: categories.find((c) => c.slug === "labor")?.articles_count || 0, unit: "مادة محققة" },
    { title: "الأدوات القانونية", desc: "مقارنة النصوص، استخراج نصوص PDF، الاستشهاد القانوني والملاحظات.", href: "/tools", image: "/images/scales-of-justice-gold.jpg", count: 12, unit: "أداة تفاعلية" },
  ];

  return (
    <div className="bg-[#FAF8F4]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#070E1C] text-[#FAF8F4]">
        <img
          src="/images/hero-old-sanaa-flag.jpg"
          alt="صنعاء القديمة وعلم الجمهورية اليمنية"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070E1C]/75 via-[#0B162C]/65 to-[#070E1C]/95" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-3 rounded-full border border-[#C6A253]/45 bg-[#0B162C]/80 px-4 py-1.5 text-xs font-medium text-[#E6C97E] backdrop-blur-md">
              <span className="inline-flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-white/25 shrink-0" aria-hidden="true">
                <span className="h-1/3 w-full bg-[#CE1126]" />
                <span className="h-1/3 w-full bg-[#FFFFFF]" />
                <span className="h-1/3 w-full bg-[#000000]" />
              </span>
              <ShieldCheck className="h-4 w-4" />
              <span>الجمهورية اليمنية — منصة توثيق تشريعي وقضائي من المصادر الرسمية</span>
            </div>

            <BrandEmblem size={84} className="mb-5 drop-shadow-[0_0_25px_rgba(198,162,83,0.35)]" />

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#FAF8F4] sm:text-5xl lg:text-6xl">
              كل التشريعات اليمنية في مكان واحد
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#FAF8F4]/80 sm:text-base lg:text-lg">
              منصة قانونية رقمية متكاملة تتيح الوصول إلى القوانين اليمنية والمواد التشريعية
              والمراجع القانونية والأحكام والمبادئ القضائية المتاحة، في بيئة بحثية متطورة
              تخدم القضاة والمحامين وأعضاء النيابة العامة والباحثين.
            </p>

            <div className="mt-8 w-full">
              <HeroSearchBar />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/constitution"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FAF8F4] px-5 py-2.5 text-xs font-bold text-[#0B162C] transition hover:bg-[#E6C97E]"
              >
                <Scale className="h-4 w-4 text-[#8C6D2E]" />
                الدستور اليمني
              </Link>
              <Link
                href="/encyclopedia"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C6A253]/50 bg-[#0B162C]/70 px-5 py-2.5 text-xs font-semibold text-[#E6C97E] transition hover:bg-[#122344]"
              >
                <BookOpen className="h-4 w-4" />
                الموسوعة التشريعية
              </Link>
              <Link
                href="/rulings"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-[#FAF8F4] transition hover:bg-white/10"
              >
                <Gavel className="h-4 w-4 text-[#C6A253]" />
                مبادئ المحكمة العليا
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-[#FAF8F4] transition hover:bg-white/10"
              >
                <Wrench className="h-4 w-4 text-[#C6A253]" />
                الأدوات القانونية
              </Link>
            </div>
          </div>

          {/* LIVE DATABASE STATS (100% REAL) */}
          <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl border border-[#C6A253]/25 bg-[#0B162C]/80 p-6 backdrop-blur-md sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6C97E] sm:text-3xl">{stats.lawsCount}</div>
              <div className="mt-1 text-xs text-[#FAF8F4]/75">تشريعات موثقة في القاعدة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6C97E] sm:text-3xl">{stats.articlesCount}</div>
              <div className="mt-1 text-xs text-[#FAF8F4]/75">مواد قانونية محققة النص</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6C97E] sm:text-3xl">{stats.rulingsCount}</div>
              <div className="mt-1 text-xs text-[#FAF8F4]/75">مبادئ وأحكام قضائية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6C97E] sm:text-3xl">{stats.categoriesCount}</div>
              <div className="mt-1 text-xs text-[#FAF8F4]/75">تصنيفاً تشريعياً معتمداً</div>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL LEGAL CARDS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold tracking-wider text-[#8C6D2E]">البوابات التخصصية</span>
            <h2 className="mt-1 text-2xl font-bold text-[#0B162C] sm:text-3xl">
              أقسام الموسوعة القانونية والقضائية
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B162C] hover:text-[#8C6D2E]"
          >
            استعراض جميع التصنيفات (20)
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredCards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-[#C6A253]/25 bg-[#0B162C] p-5 text-[#FAF8F4] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C6A253] hover:shadow-xl"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070E1C] via-[#0B162C]/75 to-transparent" />
              <div className="relative z-10">
                <div className="mb-2 inline-flex items-center rounded-full border border-[#C6A253]/40 bg-[#0B162C]/80 px-2.5 py-0.5 text-[11px] font-semibold text-[#E6C97E]">
                  {card.count} {card.unit}
                </div>
                <h3 className="text-lg font-bold text-[#FAF8F4] group-hover:text-[#E6C97E]">
                  {card.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#FAF8F4]/75">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST VERIFIED LEGISLATIONS & SUPREME COURT PRINCIPLES */}
      <section className="border-y border-[#C6A253]/20 bg-[#F3EFE6] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* Latest Laws */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-[#8C6D2E]" />
                <h2 className="text-xl font-bold text-[#0B162C]">أحدث التشريعات الموثقة</h2>
              </div>
              <Link href="/encyclopedia" className="text-xs font-bold text-[#8C6D2E] hover:underline">
                عرض الكل ←
              </Link>
            </div>
            <div className="space-y-4">
              {laws.map((law) => (
                <Link
                  key={law.id}
                  href={`/laws/${law.slug}`}
                  className="block rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4 transition hover:border-[#C6A253] hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded bg-[#0B162C]/5 px-2 py-0.5 text-[11px] font-semibold text-[#0B162C]">
                        {law.category_name}
                      </span>
                      <h3 className="mt-1.5 text-base font-bold text-[#0B162C]">{law.title}</h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-900/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {law.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#1E2430]/70">
                    <span>رقم ({law.law_number}) لسنة {law.issue_year}</span>
                    <span>المواد المدرجة: {law.articles_count}</span>
                    <span>المصدر: {law.official_source}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Supreme Court Principles */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-[#8C6D2E]" />
                <h2 className="text-xl font-bold text-[#0B162C]">مبادئ المحكمة العليا اليمنية</h2>
              </div>
              <Link href="/rulings" className="text-xs font-bold text-[#8C6D2E] hover:underline">
                عرض الكل ←
              </Link>
            </div>
            <div className="space-y-4">
              {rulings.map((r) => (
                <div
                  key={String(r.id)}
                  className="rounded-xl border border-[#C6A253]/25 bg-[#FAF8F4] p-4"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-[#8C6D2E]">
                      {String(r.court)} — {String(r.chamber)}
                    </span>
                    <span className="rounded bg-[#0B162C] px-2 py-0.5 text-[10px] text-[#E6C97E]">
                      {String(r.case_type)}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold text-[#0B162C]">{String(r.dispute_subject)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#1E2430]/85">{String(r.principle)}</p>
                  <div className="mt-2 text-[11px] text-[#1E2430]/60">
                    المصدر: {String(r.source)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEGAL NEWS & STUDIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-[#8C6D2E]" />
            <h2 className="text-2xl font-bold text-[#0B162C]">المستجدات والدراسات القانونية</h2>
          </div>
          <Link href="/news" className="text-xs font-bold text-[#8C6D2E] hover:underline">
            كافة الأخبار والدراسات ←
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item) => (
            <article
              key={String(item.id)}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#C6A253]/25 bg-white shadow-sm"
            >
              {item.image_url ? (
                <img
                  src={String(item.image_url)}
                  alt={String(item.title)}
                  className="h-44 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-[11px] text-[#8C6D2E]">
                  <span className="font-semibold">{String(item.source_name)}</span>
                  <span>{String(item.published_at)}</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-[#0B162C]">{String(item.title)}</h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-[#1E2430]/75">
                  {String(item.summary)}
                </p>
                <Link
                  href={`/news#item-${item.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0B162C] hover:text-[#8C6D2E]"
                >
                  قراءة التفاصيل ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
