import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const course = await db.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { order: "asc" } },
        tags: true,
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Course detail error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
