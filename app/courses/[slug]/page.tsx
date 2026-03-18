export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/courses/ProgressBar";
import { BookOpen, Users, ArrowRight } from "lucide-react";
import { content } from "@/lib/content";
import { CourseLevel } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const levelVariant: Record<CourseLevel, "beginner" | "intermediate" | "advanced"> = {
  [CourseLevel.BEGINNER]: "beginner",
  [CourseLevel.INTERMEDIATE]: "intermediate",
  [CourseLevel.ADVANCED]: "advanced"
};

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
      tags: true,
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) notFound();

  const session = await auth();
  let enrollment = null;
  let completedLessonIds: string[] = [];

  if (session?.user) {
    enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });

    if (enrollment) {
      const progress = await db.progress.findMany({
        where: { userId: session.user.id, completed: true, lessonId: { in: course.lessons.map((l) => l.id) } },
      });
      completedLessonIds = progress.map((p) => p.lessonId);
    }
  }

  const progressPercent = course.lessons.length > 0
    ? Math.round((completedLessonIds.length / course.lessons.length) * 100)
    : 0;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex gap-2 mb-4">
            <Badge variant={levelVariant[course.level]}>{content.courses.levels[course.level as keyof typeof content.courses.levels].th}</Badge>
            {course.tags.map((tag) => <Badge key={tag.id}>{tag.name}</Badge>)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{course.title}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">{course.description}</p>

          <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons.length} บทเรียน</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course._count.enrollments} ผู้เรียน</span>
          </div>

          {enrollment && <ProgressBar percent={progressPercent} className="mb-6 max-w-md" />}

          {!session ? (
            <Link href="/auth/login"><Button size="lg">เข้าสู่ระบบเพื่อลงทะเบียน</Button></Link>
          ) : !enrollment ? (
            <EnrollButton courseId={course.id} slug={slug} />
          ) : null}
        </div>

        {/* Lessons */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">เนื้อหาบทเรียน</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {course.lessons.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              return (
                <div key={lesson.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                      {isCompleted ? "✓" : lesson.order}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">{lesson.title}</span>
                  </div>
                  {enrollment && (
                    <Link href={`/courses/${slug}/${lesson.id}`}>
                      <Button variant="ghost" size="sm">
                        {isCompleted ? "ทบทวน" : "เรียน"} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side enroll button
function EnrollButton({ courseId, slug }: { courseId: string; slug: string }) {
  "use client";
  return (
    <form action={async () => {
      "use server";
      const session = await auth();
      if (!session?.user) return;
      await db.enrollment.create({ data: { userId: session.user.id, courseId } });
      revalidatePath(`/courses/${slug}`);
      redirect(`/courses/${slug}`);
    }}>
      <Button type="submit" size="lg">{content.courses.enrollBtn.th}</Button>
    </form>
  );
}
