import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "laws:edit")) {
    return NextResponse.json({ error: "غير مصرح لك بإضافة المواد القانونية." }, { status: 403 });
  }

  try {
    const { law_id, chapter_id, article_number, article_num_int, title, content, official_source } = await request.json();
    if (!law_id || !article_number || !content) {
      return NextResponse.json({ error: "يرجى إدخال القانون ورقم المادة ونصها." }, { status: 400 });
    }

    const db = getDb();
    const law = db.prepare("SELECT id, title FROM laws WHERE id = ?").get(Number(law_id)) as { id: number; title: string } | undefined;
    if (!law) {
      return NextResponse.json({ error: "القانون غير موجود." }, { status: 404 });
    }

    const numInt = Number(article_num_int) || parseInt(String(article_number).replace(/\D/g, ""), 10) || 0;
    const res = db
      .prepare(
        `INSERT INTO articles (law_id, chapter_id, article_number, article_num_int, title, content, official_source, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(Number(law_id), chapter_id || null, article_number, numInt, title || null, content, official_source || null, numInt);

    const articleId = Number(res.lastInsertRowid);
    db.prepare(
      `INSERT INTO articles_fts (article_id, law_id, law_title, article_number, title, content) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(articleId, law.id, law.title, article_number, title || "", content);

    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "CREATE",
      entityType: "article",
      entityId: articleId,
      entityTitle: `${article_number} - ${law.title}`,
    });

    return NextResponse.json({ id: articleId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إضافة المادة القانونية." }, { status: 500 });
  }
}
