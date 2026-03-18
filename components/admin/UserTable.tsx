"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Trash2, ShieldCheck, User as UserIcon } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  createdAt: string;
}

interface UserTableProps {
  initialUsers: UserRow[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (error) {
      console.error("Toggle role error:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="ค้นหาผู้ใช้..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4"
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ชื่อ</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">อีเมล</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">บทบาท</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">คะแนน</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">วันที่สมัคร</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{user.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "warning" : "default"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">{user.points}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRole(user.id, user.role)}
                      title={user.role === "ADMIN" ? "ลดเป็น User" : "เลื่อนเป็น Admin"}
                    >
                      {user.role === "ADMIN" ? (
                        <UserIcon className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
