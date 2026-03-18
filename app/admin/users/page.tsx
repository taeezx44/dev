export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import UserTable from "@/components/admin/UserTable";

export const metadata = { title: "จัดการผู้ใช้ | DevAcademy Admin" };

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, points: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">จัดการผู้ใช้ / User Management</h1>
      <UserTable initialUsers={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))} />
    </div>
  );
}
