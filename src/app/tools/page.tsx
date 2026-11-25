import React from "react";
import { Wrench } from "lucide-react";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { LegalToolsClient } from "@/components/LegalToolsClient";

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const user = await getCurrentUser();
  const db = getDb();
  const articles = db
    .prepare(
      `SELECT a.id, a.law_id, a.article_number, a.title, a.content, a.official_source,
        l.title as law_title, l.law_number, l.issue_year
       FROM articles a
       JOIN laws l ON a.law_id = l.id
       ORDER BY a.id ASC
       LIMIT 60`
    )
    .all() as {
    id: number;
    law_id: number;
    law_title: string;
    law_number: string;
    issue_year: number;
    article_number: string;
    title: string | null;
    content: string;
    official_source: string | null;
  }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <Wrench className="h-4 w-4" />
          <span>مركز الأدوات القانونية المتكامل</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">أدوات البحث والمقارنة والتوثيق القانوني</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#FAF8F4]/75">
          مجموعة أدوات عملية متكاملة للمحامين والقضاة والباحثين: مقارنة النصوص التشريعية، مقارنة مواد قانونين،
          استخراج نصوص PDF، البحث داخل المستندات، توليد الاستشهاد القانوني، وحفظ الملاحظات وقوائم المراجع.
        </p>
      </div>

      <LegalToolsClient articles={articles} isLoggedIn={Boolean(user)} />
    </div>
  );
}
