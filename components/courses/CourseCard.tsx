import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { content } from "@/lib/content";

import { CourseLevel } from "@prisma/client";

interface CourseCardProps {
  course: {
    slug: string;
    title: string;
    description: string;
    level: CourseLevel;
    _count: { lessons: number; enrollments: number };
    tags: { id: string; name: string }[];
  };
}

const levelVariant: Record<CourseLevel, "beginner" | "intermediate" | "advanced"> = {
  [CourseLevel.BEGINNER]: "beginner",
  [CourseLevel.INTERMEDIATE]: "intermediate",
  [CourseLevel.ADVANCED]: "advanced",
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 flex flex-col">
      {/* Header gradient */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-2xl" />

      <CardContent className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={levelVariant[course.level]}>
            {content.courses.levels[course.level as keyof typeof content.courses.levels].th}
          </Badge>
          {course.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant="default">{tag.name}</Badge>
          ))}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {course._count.lessons} {content.courses.lessons.th}
          </span>
          <span>{course._count.enrollments} ผู้เรียน</span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/courses/${course.slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            {content.courses.enrollBtn.th}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
