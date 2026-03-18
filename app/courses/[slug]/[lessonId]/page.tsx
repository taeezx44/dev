export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { content } from "@/lib/content";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;

  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const course = await db.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!enrollment) redirect(`/courses/${slug}`);

  const currentLesson = course.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) notFound();

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  const progress = await db.progress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
  });

  const isCompleted = progress?.completed ?? false;

  async function markComplete() {
    "use server";
    const s = await auth();
    if (!s?.user) return;

    await db.progress.upsert({
      where: { userId_lessonId: { userId: s.user.id, lessonId } },
      create: { userId: s.user.id, lessonId, completed: true },
      update: { completed: true },
    });

    const existing = await db.progress.findUnique({
      where: { userId_lessonId: { userId: s.user.id, lessonId } },
    });

    if (!existing || !existing.completed) {
      await db.user.update({
        where: { id: s.user.id },
        data: { points: { increment: 10 } },
      });
    }

    redirect(`/courses/${slug}/${lessonId}`);
  }

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href={`/courses/${slug}`} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> กลับไปหน้าหลักสูตร
          </Link>
        </div>

        {/* Lesson header */}
        <div className="mb-8">
          <span className="text-sm text-slate-500 dark:text-slate-400">บทที่ {currentLesson.order} / {course.lessons.length}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-1">{currentLesson.title}</h1>
        </div>

        {/* Lesson content */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
          <div className="prose-content text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
        </div>

        {/* Mark complete button */}
        <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">{content.lesson.completed.th}</span>
            </div>
          ) : (
            <form action={markComplete}>
              <Button type="submit">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {content.lesson.markComplete.th} (+10 pts)
              </Button>
            </form>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link href={`/courses/${slug}/${prevLesson.id}`}>
              <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-1" /> {content.lesson.prev.th}</Button>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/courses/${slug}/${nextLesson.id}`}>
              <Button>{content.lesson.next.th} <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          ) : (
            <Link href={`/courses/${slug}`}>
              <Button variant="secondary">กลับไปหน้าหลักสูตร</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
