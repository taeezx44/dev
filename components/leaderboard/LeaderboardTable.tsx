"use client";

import { useSession } from "next-auth/react";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { content } from "@/lib/content";

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string | null;
  points: number;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  const { data: session } = useSession();

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 w-16">
              {content.leaderboard.rank.th}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
              {content.leaderboard.name.th}
            </th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
              {content.leaderboard.points.th}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user, index) => {
            const isCurrentUser = session?.user?.id === user.id;
            const rank = index + 1;

            return (
              <tr
                key={user.id}
                className={cn(
                  "transition-colors",
                  isCurrentUser
                    ? "bg-indigo-50 dark:bg-indigo-900/20"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                )}
              >
                <td className="px-4 py-4">
                  {rank <= 3 ? (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      rank === 1 && "bg-yellow-100 dark:bg-yellow-900/30",
                      rank === 2 && "bg-slate-100 dark:bg-slate-700",
                      rank === 3 && "bg-amber-100 dark:bg-amber-900/30"
                    )}>
                      {rank === 1 ? (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Medal className={cn("w-4 h-4", rank === 2 ? "text-slate-400" : "text-amber-600")} />
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400 font-medium pl-2">{rank}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isCurrentUser ? "text-indigo-700 dark:text-indigo-400" : "text-slate-900 dark:text-white"
                    )}>
                      {user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">(คุณ)</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{user.points}</span>
                  <span className="text-slate-400 ml-1 text-xs">pts</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
