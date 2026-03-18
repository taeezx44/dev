import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, className, showLabel = true }: ProgressBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-500 dark:text-slate-400">ความคืบหน้า</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{percent}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
