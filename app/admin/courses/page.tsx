export const dynamic = "force-dynamic";
import Link from "next/link";
import { db } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Plus, Edit } from "lucide-react";

import { CourseLevel } from "@prisma/client";

export const metadata = { title: "จัดการหลักสูตร | DevAcademy Admin" };

const levelVariant: Record<CourseLevel, "beginner" | "intermediate" | "advanced"> = {
  [CourseLevel.BEGINNER]: "beginner",
  [CourseLevel.INTERMEDIATE]: "intermediate",
  [CourseLevel.ADVANCED]: "advanced"
};

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: { _count: { select: { enrollments: true, lessons: true } }, tags: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">จัดการหลักสูตร / Courses</h1>
        <Link href="/admin/courses/new">
          <Button size="sm"><Plus className="w-4 h-4 mr-1" /> สร้างหลักสูตรใหม่</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ชื่อหลักสูตร</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ระดับ</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">สถานะ</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">บทเรียน</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">ผู้เรียน</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {courses.map((course: any) => (
              <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900 dark:text-white">{course.title}</span>
                  <div className="flex gap-1 mt-1">
                    {course.tags.slice(0, 2).map((t: any) => <Badge key={t.id} variant="default">{t.name}</Badge>)}
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant={levelVariant[course.level as CourseLevel]}>{course.level}</Badge></td>
                <td className="px-4 py-3">
                  <Badge variant={course.published ? "success" : "warning"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{course._count.lessons}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{course._count.enrollments}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/courses/${course.id}/edit`}>
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
