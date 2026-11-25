import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getLaws } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const laws = getLaws({
    categorySlug: searchParams.get("category") || undefined,
    status: searchParams.get("status") || undefined,
    year: searchParams.get("year") ? Number(searchParams.get("year")) : undefined,
  });
  return NextResponse.json({ laws });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "laws:create")) {
    return NextResponse.json({ error: "غير مصرح لك بإضافة التشريعات." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      title,
      law_number,
      issue_year,
      issue_date,
      issuing_authority,
      category_id,
      status,
      official_source,
      official_source_url,
      official_gazette_no,
      verification_status,
      summary,
      pdf_url,
    } = body;

    if (!title || !law_number || !issue_year || !issuing_authority || !category_id || !official_source) {
      return NextResponse.json({ error: "يرجى استكمال كافة الحقول الإلزامية للتشريع." }, { status: 400 });
    }

    const slug = `law-${law_number}-${issue_year}-${Date.now().toString(36)}`;
    const db = getDb();
    const res = db
      .prepare(
        `INSERT INTO laws (slug, title, law_number, issue_year, issue_date, issuing_authority, category_id, status, official_source, official_source_url, official_gazette_no, verification_status, last_reviewed_at, summary, pdf_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, ?)`
      )
      .run(
        slug,
        title,
        law_number,
        Number(issue_year),
        issue_date || null,
        issuing_authority,
        Number(category_id),
        status || "ساري",
        official_source,
        official_source_url || null,
        official_gazette_no || null,
        verification_status || "موثق من المصدر الرسمي",
        summary || null,
        pdf_url || null
      );

    const lawId = Number(res.lastInsertRowid);
    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "CREATE",
      entityType: "law",
      entityId: lawId,
      entityTitle: title,
      details: `قانون رقم (${law_number}) لسنة ${issue_year}`,
    });

    return NextResponse.json({ id: lawId, slug }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ التشريع." }, { status: 500 });
  }
}
