import React from "react";
import { Newspaper, ExternalLink } from "lucide-react";
import { getLegalNews } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const items = getLegalNews();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <Newspaper className="h-4 w-4" />
          <span>الأخبار والمستجدات والأبحاث القانونية</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">التحديثات التشريعية والدراسات القانونية</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#FAF8F4]/75">
          متابعة موثقة للتشريعات المضافة، التعديلات القانونية، الدراسات الفقهية والقانونية، وإصدارات الجهات القضائية.
        </p>
      </div>

      <div className="space-y-6">
        {items.map((item) => (
          <article
            key={String(item.id)}
            id={`item-${item.id}`}
            className="grid gap-6 overflow-hidden rounded-2xl border border-[#C6A253]/30 bg-white p-6 shadow-sm md:grid-cols-3"
          >
            {item.image_url ? (
              <img
                src={String(item.image_url)}
                alt={String(item.title)}
                className="h-52 w-full rounded-xl object-cover md:col-span-1"
              />
            ) : null}
            <div className="flex flex-col justify-between md:col-span-2">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C6D2E]">
                  <span className="rounded bg-[#F3EFE6] px-2.5 py-0.5 font-bold">{String(item.source_name)}</span>
                  <span>{String(item.published_at)}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-[#0B162C]">{String(item.title)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#1E2430]/85">{String(item.content)}</p>
              </div>
              {item.source_url ? (
                <div className="mt-4">
                  <a
                    href={String(item.source_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0B162C] hover:text-[#8C6D2E]"
                  >
                    الانتقال إلى المصدر الرسمي <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
