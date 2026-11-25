import { NextResponse } from "next/server";
import { searchLegalDatabase } from "@/lib/queries";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const suggest = searchParams.get("suggest") === "1";

  if (suggest) {
    const db = getDb();
    const term = q.trim();
    if (!term) return NextResponse.json({ suggestions: [] });
    const like = `%${term}%`;
    const laws = db
      .prepare("SELECT title, slug, law_number, issue_year FROM laws WHERE title LIKE ? OR law_number LIKE ? LIMIT 5")
      .all(like, like) as { title: string; slug: string; law_number: string; issue_year: number }[];
    const articles = db
      .prepare(
        `SELECT a.id, a.article_number, a.title, l.title as law_title
         FROM articles a JOIN laws l ON a.law_id = l.id
         WHERE a.title LIKE ? OR a.content LIKE ? OR a.article_number LIKE ? LIMIT 5`
      )
      .all(like, like, like) as { id: number; article_number: string; title: string; law_title: string }[];

    return NextResponse.json({
      suggestions: [
        ...laws.map((l) => ({ type: "law", label: `${l.title} (${l.law_number} لسنة ${l.issue_year})`, href: `/laws/${l.slug}` })),
        ...articles.map((a) => ({ type: "article", label: `${a.article_number}: ${a.title || ""} — ${a.law_title}`, href: `/articles/${a.id}` })),
      ],
    });
  }

  const results = searchLegalDatabase({
    q,
    category: searchParams.get("category") || undefined,
    year: searchParams.get("year") || undefined,
    lawNumber: searchParams.get("lawNumber") || undefined,
    status: searchParams.get("status") || undefined,
    authority: searchParams.get("authority") || undefined,
    exact: searchParams.get("exact") === "1",
  });

  return NextResponse.json(results);
}
