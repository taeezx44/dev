import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: { id: true, name: true, avatar: true, points: true },
      orderBy: { points: "desc" },
      take: 20,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
