"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { content } from "@/lib/content";
import { Send, User } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; avatar: string | null };
}

interface CommentSectionProps {
  postSlug: string;
  initialComments: Comment[];
}

export default function CommentSection({ postSlug, initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Comment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        {content.blog.comments.th} ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="เขียนความคิดเห็น..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <Button type="submit" size="sm" disabled={loading || !newComment.trim()}>
                  <Send className="w-4 h-4 mr-1" />
                  {loading ? "กำลังส่ง..." : content.blog.addComment.th}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          กรุณา<a href="/auth/login" className="text-indigo-600 font-semibold"> เข้าสู่ระบบ </a>เพื่อแสดงความคิดเห็น
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-indigo-600">
                {comment.author.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-slate-900 dark:text-white">
                  {comment.author.name}
                </span>
                <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-center text-slate-400 py-8">ยังไม่มีความคิดเห็น</p>
        )}
      </div>
    </div>
  );
}
