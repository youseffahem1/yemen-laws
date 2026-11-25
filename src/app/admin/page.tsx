import React from "react";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentUser, hasPermission, ROLE_LABELS_AR } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getCategoriesWithCounts, getLaws, getPlatformStats, getJudicialRulings } from "@/lib/queries";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, "admin:access")) {
    redirect("/login");
  }

  const db = getDb();
  const stats = getPlatformStats();
  const searchesCount = (db.prepare("SELECT COUNT(*) as c FROM search_logs").get() as { c: number }).c;
  const categories = getCategoriesWithCounts();
  const laws = getLaws();
  const rulings = getJudicialRulings() as { id: number; court: string; chamber: string; case_type: string; dispute_subject: string }[];
  const users =
    user.role === "admin"
      ? (db.prepare("SELECT id, name, email, role, status, title FROM users ORDER BY id ASC").all() as {
          id: number;
          name: string;
          email: string;
          role: "admin" | "editor" | "lawyer" | "judge" | "researcher" | "student" | "visitor";
          status: string;
          title: string | null;
        }[])
      : [];
  const auditLogs = db.prepare("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50").all() as {
    id: number;
    user_name: string;
    user_role: string;
    action: string;
    entity_type: string;
    entity_title: string | null;
    created_at: string;
  }[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl bg-[#0B162C] p-8 text-[#FAF8F4]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#E6C97E]">
          <ShieldCheck className="h-4 w-4" />
          <span>لوحة التحكم الإدارية — {ROLE_LABELS_AR[user.role]}</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold">إدارة الموسوعة القانونية والقضائية</h1>
        <p className="mt-2 text-xs text-[#FAF8F4]/75">
          مرحباً {user.name}. كافة الإجراءات محمية بصلاحيات الخادم ومسجلة تلقائياً في سجل النشاطات.
        </p>
      </div>

      <AdminDashboardClient
        currentUserRole={user.role}
        stats={{ ...stats, usersCount: stats.usersCount, searchesCount }}
        categories={categories}
        laws={laws}
        rulings={rulings}
        users={users}
        auditLogs={auditLogs}
      />
    </div>
  );
}
