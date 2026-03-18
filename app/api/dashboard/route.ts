import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            lessons: { select: { id: true } },
            _count: { select: { lessons: true } },
          },
        },
      },
    });

    const progress = await db.progress.findMany({
      where: { userId: session.user.id, completed: true },
    });

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    // Calculate rank
    const rank = await db.user.count({
      where: { points: { gt: user?.points || 0 } },
    });

    const coursesWithProgress = enrollments.map((enrollment) => {
      const completedLessons = progress.filter((p) =>
        enrollment.course.lessons.some((l) => l.id === p.lessonId)
      ).length;
      const totalLessons = enrollment.course._count.lessons;

      return {
        ...enrollment.course,
        completedLessons,
        totalLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    });

    return NextResponse.json({
      courses: coursesWithProgress,
      points: user?.points || 0,
      rank: rank + 1,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
