"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface AnalyticsChartProps {
  type: "line" | "bar";
  data: Record<string, string | number>[];
  dataKey: string;
  xKey: string;
  title: string;
}

export default function AnalyticsChart({ type, data, dataKey, xKey, title }: AnalyticsChartProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey={xKey} className="text-xs" tick={{ fill: "#94a3b8" }} />
            <YAxis className="text-xs" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-slate-900, #0f172a)",
                border: "1px solid var(--color-slate-700, #334155)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Line type="monotone" dataKey={dataKey} stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey={xKey} className="text-xs" tick={{ fill: "#94a3b8" }} />
            <YAxis className="text-xs" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-slate-900, #0f172a)",
                border: "1px solid var(--color-slate-700, #334155)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar dataKey={dataKey} fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
