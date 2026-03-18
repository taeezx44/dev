"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { content } from "@/lib/content";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด");
      } else {
        router.push("/auth/login?registered=true");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <Input
        id="name"
        type="text"
        label={`${content.auth.register.name.th} (${content.auth.register.name.en})`}
        placeholder="ชื่อของคุณ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        id="email"
        type="email"
        label={`${content.auth.register.email.th} (${content.auth.register.email.en})`}
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        id="password"
        type="password"
        label={`${content.auth.register.password.th} (${content.auth.register.password.en})`}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Input
        id="confirmPassword"
        type="password"
        label={`${content.auth.register.confirmPassword.th} (${content.auth.register.confirmPassword.en})`}
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "กำลังสมัคร..." : content.auth.register.submit.th}
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {content.auth.register.hasAccount.th}{" "}
        <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
          {content.auth.register.login.th}
        </Link>
      </p>
    </form>
  );
}
