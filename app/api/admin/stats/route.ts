import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, totalCourses, totalPosts, totalEnrollments] =
      await Promise.all([
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

    // Group by date
    const usersByDay: Record<string, number> = {};
    recentUsers.forEach((u) => {
      const day = u.createdAt.toISOString().split("T")[0];
      usersByDay[day] = (usersByDay[day] || 0) + 1;
    });
    const newUsersPerDay = Object.entries(usersByDay).map(([date, count]) => ({
      date,
      count,
    }));

    // Top courses by enrollment
    const topCourses = await db.course.findMany({
      select: { title: true, _count: { select: { enrollments: true } } },
      orderBy: { enrollments: { _count: "desc" } },
      take: 5,
    });
    const enrollmentsPerCourse = topCourses.map((c) => ({
      name: c.title,
      enrollments: c._count.enrollments,
    }));

    // Recent signups
    const recentSignups = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalUsers,
      totalCourses,
      totalPosts,
      totalEnrollments,
      newUsersPerDay,
      enrollmentsPerCourse,
      recentSignups,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
