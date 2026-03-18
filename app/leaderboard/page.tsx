export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export const metadata = { title: "ลีดเดอร์บอร์ด | DevAcademy" };

export default async function LeaderboardPage() {
  const users = await db.user.findMany({
    select: { id: true, name: true, avatar: true, points: true },
    orderBy: { points: "desc" },
    take: 20,
  });

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{content.leaderboard.heading.th}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.leaderboard.heading.en}</p>
        </div>
        <LeaderboardTable users={users} />
      </div>
    </div>
  );
}
