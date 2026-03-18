import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: { published: true },
      include: {
        tags: true,
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
