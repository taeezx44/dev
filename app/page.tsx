export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Map, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import CourseCard from "@/components/courses/CourseCard";
import PostCard from "@/components/blog/PostCard";
import Button from "@/components/ui/Button";

async function getData() {
  const [courses, posts, topUsers] = await Promise.all([
    db.course.findMany({
      where: { published: true },
      include: { tags: true, _count: { select: { lessons: true, enrollments: true } } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.post.findMany({
      where: { published: true },
      include: { tags: true, _count: { select: { comments: true } } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    db.user.findMany({
      select: { id: true, name: true, points: true },
      orderBy: { points: "desc" },
      take: 5,
    }),
  ]);
  return { courses, posts, topUsers };
}

export default async function HomePage() {
  const { courses, posts, topUsers } = await getData();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0F172A] overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium mb-8">
            <Code2 className="w-4 h-4" />
            {content.global.tagline.th}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 whitespace-pre-line">
            {content.home.hero.title.th}
          </h1>
          <p className="text-xl text-slate-400 mb-2 max-w-2xl mx-auto">{content.home.hero.title.en}</p>
          <p className="text-lg text-slate-300 mt-6 max-w-2xl mx-auto">{content.home.hero.subtitle.th}</p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8 py-4">
                {content.home.hero.primaryCta.th}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10">
                {content.home.hero.secondaryCta.th}
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { icon: BookOpen, label: "หลักสูตร", value: `${courses.length}+` },
              { icon: Code2, label: "Playground", value: "Free" },
              { icon: Map, label: "Roadmap", value: "3 เส้นทาง" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{content.home.featuredCourses.th}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{content.home.featuredCourses.en}</p>
            </div>
            <Link href="/courses">
              <Button variant="outline" size="sm">ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{content.home.latestPosts.th}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{content.home.latestPosts.en}</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" size="sm">ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={{...post, createdAt: post.createdAt.toISOString()}} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Learners */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{content.home.topLearners.th}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{content.home.topLearners.en}</p>
          </div>
          <div className="space-y-3">
            {topUsers.map((user: any, i: number) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{user.points} pts</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/leaderboard"><Button variant="outline">ดูลีดเดอร์บอร์ดทั้งหมด</Button></Link>
          </div>
        </div>
      </section>

      {/* Roadmap Teaser */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{content.home.roadmapTeaser.title.th}</h2>
          <p className="text-xl text-indigo-200 mb-8">{content.home.roadmapTeaser.subtitle.th}</p>
          <Link href="/roadmap">
            <Button variant="secondary" size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
              {content.home.roadmapTeaser.cta.th}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
