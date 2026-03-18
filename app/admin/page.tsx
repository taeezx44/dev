export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import StatsCard from "@/components/admin/StatsCard";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import { Users, BookOpen, FileText, GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "แผงควบคุม | DevAcademy Admin" };

export default async function AdminDashboardPage() {
  const [totalUsers, totalCourses, totalPosts, totalEnrollments] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.post.count(),
    db.enrollment.count(),
  ]);

  // New users per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await db.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const usersByDay: Record<string, number> = {};
  recentUsers.forEach((u) => {
    const day = u.createdAt.toISOString().split("T")[0];
    usersByDay[day] = (usersByDay[day] || 0) + 1;
  });
  const newUsersPerDay = Object.entries(usersByDay).map(([date, count]) => ({ date, count }));

  // Top courses by enrollment
  const topCourses = await db.course.findMany({
    select: { title: true, _count: { select: { enrollments: true } } },
    orderBy: { enrollments: { _count: "desc" } },
    take: 5,
  });
  const enrollmentsPerCourse = topCourses.map((c) => ({
    name: c.title.length > 20 ? c.title.slice(0, 20) + "..." : c.title,
    enrollments: c._count.enrollments,
  }));

  // Recent signups
  const recentSignups = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{content.admin.heading.th}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title={content.admin.stats.users.th} value={totalUsers} icon={Users} />
        <StatsCard title={content.admin.stats.courses.th} value={totalCourses} icon={BookOpen} />
        <StatsCard title={content.admin.stats.posts.th} value={totalPosts} icon={FileText} />
        <StatsCard title={content.admin.stats.enrollments.th} value={totalEnrollments} icon={GraduationCap} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart type="line" data={newUsersPerDay} dataKey="count" xKey="date" title="ผู้ใช้ใหม่ต่อวัน (30 วัน)" />
        <AnalyticsChart type="bar" data={enrollmentsPerCourse} dataKey="enrollments" xKey="name" title="หลักสูตรยอดนิยม" />
      </div>

      {/* Recent Signups */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">ผู้ใช้สมัครล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ชื่อ</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">อีเมล</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">บทบาท</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentSignups.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.role === "ADMIN" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
