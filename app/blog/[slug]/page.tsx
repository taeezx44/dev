export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import CommentSection from "@/components/blog/CommentSection";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      tags: true,
      comments: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) notFound();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => <Badge key={tag.id} variant="info">{tag.name}</Badge>)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="prose-content text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <CommentSection
          postSlug={post.slug}
          initialComments={post.comments.map((c) => ({
            ...c,
            createdAt: c.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
