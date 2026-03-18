import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { content } from "@/lib/content";

interface PostCardProps {
  post: {
    slug: string;
    title: string;
    content: string;
    createdAt: string;
    tags: { id: string; name: string }[];
    _count: { comments: number };
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Strip HTML for preview
  const preview = post.content.replace(/<[^>]+>/g, "").slice(0, 120) + "...";

  return (
    <Card className="group hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-t-2xl" />
      <CardContent>
        <div className="flex gap-2 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="info">{tag.name}</Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{preview}</p>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post._count.comments} {content.blog.comments.th}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
