"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    level: "BEGINNER",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/courses");
        router.refresh();
      } else {
        alert("เกิดข้อผิดพลาดในการสร้างหลักสูตร");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">สร้างหลักสูตรใหม่</h1>
        <Button variant="outline" onClick={() => router.back()}>
          ยกเลิก
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                ชื่อหลักสูตร
              </label>
              <Input
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  });
                }}
                placeholder="เช่น: React สำหรับคนเริ่มจากศูนย์"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Slug (URL)
              </label>
              <Input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="react-for-beginners"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                รายละเอียดแบบย่อ
              </label>
              <textarea
                required
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="คำอธิบายสั้นๆ เกี่ยวกับหลักสูตรนี้..."
              />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                ระดับความยาก 
               </label>
               <select 
                 className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                 value={form.level}
                 onChange={(e) => setForm({ ...form, level: e.target.value })}
               >
                 <option value="BEGINNER">เริ่มต้น (Beginner)</option>
                 <option value="INTERMEDIATE">ระดับกลาง (Intermediate)</option>
                 <option value="ADVANCED">ขั้นสูง (Advanced)</option>
               </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                เผยแพร่ทันที
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "กำลังบันทึก..." : "บันทึกหลักสูตร"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
