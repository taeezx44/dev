"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">เกิดข้อผิดพลาดบางอย่าง</h1>
        <p className="text-slate-600 dark:text-slate-400">
          ขออภัยในความไม่สะดวก ระบบเกิดข้อผิดพลาดในการโหลดข้อมูล 
          กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูลหรือลองใหม่อีกครั้ง
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-900 p-2 rounded">
            Error Digest: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => reset()} size="lg">
            ลองใหม่อีกครั้ง
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  );
}
