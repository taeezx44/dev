export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import { CourseLevel } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/Card";
import ProgressBar from "@/components/courses/ProgressBar";
import Badge from "@/components/ui/Badge";
import { Trophy, BookOpen, ArrowRight } from "lucide-react";

export const metadata = { title: "แดชบอร์ด | DevAcademy" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { points: true },
  });

  const rank = await db.user.count({
    where: { points: { gt: user?.points || 0 } },
  });

  const enrollments = await db.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
          _count: { select: { lessons: true } },
          tags: true,
        },
      },
    },
  });

  const progress = await db.progress.findMany({
    where: { userId: session.user.id, completed: true },
  });

  const coursesWithProgress = enrollments.map((e: any) => {
    const completed = progress.filter((p: any) => e.course.lessons.some((l: { id: string }) => l.id === p.lessonId)).length;
    const total = e.course._count.lessons;
    return {
      ...e.course,
      completedLessons: completed,
      totalLessons: total,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const levelVariant: Record<CourseLevel, "beginner" | "intermediate" | "advanced"> = {
    [CourseLevel.BEGINNER]: "beginner",
    [CourseLevel.INTERMEDIATE]: "intermediate",
    [CourseLevel.ADVANCED]: "advanced"
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{content.dashboard.heading.th}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">สวัสดี, {session.user.name}</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{content.dashboard.myCourses.th}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{enrollments.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{content.dashboard.myPoints.th}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{user?.points || 0} pts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">#{rank + 1}</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{content.dashboard.myRank.th}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">อันดับ {rank + 1}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{content.dashboard.myCourses.th}</h2>
        {coursesWithProgress.length > 0 ? (
          <div className="space-y-4">
            {coursesWithProgress.map((course: any) => (
              <Card key={course.id}>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={levelVariant[course.level as CourseLevel]}>{course.level}</Badge>
                        {course.tags.slice(0, 2).map((t: any) => <Badge key={t.id}>{t.name}</Badge>)}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
                    </div>
                    <Link href={`/courses/${course.slug}`} className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 text-sm">
                      เรียนต่อ <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <ProgressBar percent={course.progressPercent} />
                  <p className="text-xs text-slate-500 mt-2">{course.completedLessons}/{course.totalLessons} บทเรียน</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-10">
              <p className="text-slate-500 mb-4">คุณยังไม่ได้ลงทะเบียนหลักสูตรใดๆ</p>
              <Link href="/courses" className="text-indigo-600 font-semibold hover:text-indigo-700">ดูหลักสูตรทั้งหมด →</Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
