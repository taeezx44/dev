"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  order: number;
}

interface LessonListProps {
  lessons: Lesson[];
  completedIds: string[];
  currentLessonId?: string;
  courseSlug: string;
  isEnrolled: boolean;
  onSelect?: (lessonId: string) => void;
}

export default function LessonList({
  lessons,
  completedIds,
  currentLessonId,
  courseSlug,
  isEnrolled,
  onSelect,
}: LessonListProps) {
  return (
    <div className="space-y-1">
      {lessons.map((lesson) => {
        const isCompleted = completedIds.includes(lesson.id);
        const isCurrent = lesson.id === currentLessonId;

        return (
          <button
            key={lesson.id}
            onClick={() => isEnrolled && onSelect?.(lesson.id)}
            disabled={!isEnrolled}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors",
              isCurrent
                ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800"
                : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
              !isEnrolled && "cursor-not-allowed opacity-60"
            )}
          >
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : isEnrolled ? (
                <PlayCircle className={cn("w-5 h-5", isCurrent ? "text-indigo-600" : "text-slate-400")} />
              ) : (
                <Lock className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs text-slate-400 font-medium">บทที่ {lesson.order}</span>
              <p className={cn(
                "text-sm font-medium truncate",
                isCurrent ? "text-indigo-700 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
              )}>
                {lesson.title}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
