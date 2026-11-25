export type UserRole =
  | "admin"
  | "editor"
  | "lawyer"
  | "judge"
  | "researcher"
  | "student"
  | "visitor";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  title?: string;
}

export const ROLE_LABELS_AR: Record<UserRole, string> = {
  admin: "مدير النظام",
  editor: "محرر قانوني",
  judge: "قاضٍ",
  lawyer: "محامٍ",
  researcher: "باحث قانوني",
  student: "طالب قانون",
  visitor: "زائر",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    "admin:access",
    "laws:create",
    "laws:edit",
    "laws:delete",
    "rulings:create",
    "rulings:edit",
    "rulings:delete",
    "news:manage",
    "users:manage",
    "audit:view",
    "upload:pdf",
    "tools:all",
    "personal:save",
  ],
  editor: [
    "admin:access",
    "laws:create",
    "laws:edit",
    "rulings:create",
    "rulings:edit",
    "news:manage",
    "audit:view",
    "upload:pdf",
    "tools:all",
    "personal:save",
  ],
  judge: ["tools:all", "personal:save", "rulings:read_full"],
  lawyer: ["tools:all", "personal:save", "rulings:read_full"],
  researcher: ["tools:all", "personal:save", "rulings:read_full"],
  student: ["tools:all", "personal:save"],
  visitor: ["public:read"],
};

export function hasPermission(role: UserRole | undefined | null, permission: string): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
