import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getLegalNews } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const items = getLegalNews(searchParams.get("kind") || undefined);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "news:manage")) {
    return NextResponse.json({ error: "غير مصرح لك بإدارة الأخبار والمقالات." }, { status: 403 });
  }

  try {
    const { title, kind, summary, content, source_name, source_url, published_at } = await request.json();
    if (!title || !summary || !content || !source_name) {
      return NextResponse.json({ error: "يرجى استكمال العنوان والملخص والنص والمصدر." }, { status: 400 });
    }

    const slug = `news-${Date.now().toString(36)}`;
    const db = getDb();
    const res = db
      .prepare(
        `INSERT INTO legal_news (slug, title, kind, summary, content, source_name, source_url, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(slug, title, kind || "news", summary, content, source_name, source_url || null, published_at || new Date().toISOString().slice(0, 10));

    const newsId = Number(res.lastInsertRowid);
    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "CREATE",
      entityType: "news",
      entityId: newsId,
      entityTitle: title,
    });

    return NextResponse.json({ id: newsId, slug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر نشر الخبر أو المقال." }, { status: 500 });
  }
}
