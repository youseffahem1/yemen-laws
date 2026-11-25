import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { logAudit } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "upload:pdf")) {
    return NextResponse.json({ error: "غير مصرح لك برفع الملفات." }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "لم يتم إرفاق ملف." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (ext !== ".pdf") {
      return NextResponse.json({ error: "يُسمح برفع ملفات PDF فقط." }, { status: 400 });
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "الحد الأقصى لحجم الملف 15 ميجابايت." }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const dest = path.join(uploadDir, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(dest, buffer);

    logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: "UPLOAD_PDF",
      entityType: "file",
      entityTitle: safeName,
    });

    return NextResponse.json({ url: `/uploads/${safeName}`, filename: safeName }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر رفع الملف." }, { status: 500 });
  }
}
