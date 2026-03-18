import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;

    const existing = await db.progress.findUnique({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId },
      },
    });

    if (existing?.completed) {
      return NextResponse.json({ message: "Already completed" }, { status: 200 });
    }

    await db.progress.upsert({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId },
      },
      create: { userId: session.user.id, lessonId, completed: true },
      update: { completed: true },
    });

    // Add 10 points
    await db.user.update({
      where: { id: session.user.id },
      data: { points: { increment: 10 } },
    });

    return NextResponse.json({ message: "Lesson completed! +10 points" });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
