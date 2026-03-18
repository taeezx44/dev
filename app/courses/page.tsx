export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import CourseCard from "@/components/courses/CourseCard";

export const metadata = { title: "หลักสูตรทั้งหมด | DevAcademy" };

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    include: { tags: true, _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {content.courses.heading.th}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.courses.heading.en}</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-slate-500">ยังไม่มีหลักสูตร</p>
          </div>
        )}
      </div>
    </div>
  );
}
