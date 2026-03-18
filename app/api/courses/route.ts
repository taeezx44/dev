import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CourseLevel } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get("level") as CourseLevel | null;
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const courses = await db.course.findMany({
      where: {
        published: true,
        ...(level ? { level } : {}),
        ...(tag ? { tags: { some: { name: tag } } } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { description: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      include: {
        tags: true,
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Courses API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
