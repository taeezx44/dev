export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { content } from "@/lib/content";
import PostCard from "@/components/blog/PostCard";

export const metadata = { title: "บทความ | DevAcademy" };

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    include: { tags: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{content.blog.heading.th}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.blog.heading.en}</p>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={{...post, createdAt: post.createdAt.toISOString()}} />
            ))}
          </div>
        ) : (
          <p className="text-center py-20 text-lg text-slate-500">ยังไม่มีบทความ</p>
        )}
      </div>
    </div>
  );
}
