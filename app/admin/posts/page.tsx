export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Plus, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "จัดการบทความ | DevAcademy Admin" };

export default async function AdminPostsPage() {
  const posts = await db.post.findMany({
    include: { tags: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">จัดการบทความ / Posts</h1>
        <Link href="/admin/posts/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> สร้างบทความใหม่</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">หัวข้อ</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">สถานะ</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ความคิดเห็น</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">วันที่</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-white">{post.title}</span>
                  <div className="flex gap-1 mt-1">
                    {post.tags.slice(0, 3).map((t) => <Badge key={t.id} variant="info">{t.name}</Badge>)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={post.published ? "success" : "warning"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{post._count.comments}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
