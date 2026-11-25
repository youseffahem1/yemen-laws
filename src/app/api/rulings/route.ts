import { NextResponse } from "next/server";
import { getDb, logAudit } from "@/lib/db";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getJudicialRulings } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rulings = getJudicialRulings(searchParams.get("caseType") || undefined);
  return NextResponse.json({ rulings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "rulings:create")) {
    return NextResponse.json({ error: "غير مصرح لك بإضافة الأحكام والمبادئ القضائية." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ruling_number, court, chamber, ruling_date, case_type, dispute_subject, summary, principle, source, source_url } = body;
    if (!court || !chamber || !case_type || !dispute_subject || !summary || !principle || !source) {
      return NextResponse.json({ error: "يرجى استكمال الحقول الأساسية للحكم والمبدأ القضائي." }, { status: 400 });
    }

    const db = getDb();
    const res = db
      .prepare(
        `INSERT INTO judicial_rulings (ruling_number, court, chamber, ruling_date, case_type, dispute_subject, summary, principle, source, source_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(ruling_number || null, court, chamber, ruling_date || null, case_type, dispute_subject, summary, principle, source, source_url || null);

    const rulingId = Number(res.lastInsertRowid);
    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "CREATE",
      entityType: "ruling",
      entityId: rulingId,
      entityTitle: dispute_subject,
    });

    return NextResponse.json({ id: rulingId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إضافة الحكم القضائي." }, { status: 500 });
  }
}
