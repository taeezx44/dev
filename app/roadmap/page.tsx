"use client";

import { useState } from "react";
import { content } from "@/lib/content";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

type PathKey = "frontend" | "backend" | "devops";

const roadmapData: Record<PathKey, { topic: string; status: "recommended" | "optional" }[]> = {
  frontend: [
    { topic: "HTML & CSS พื้นฐาน", status: "recommended" },
    { topic: "JavaScript ES6+", status: "recommended" },
    { topic: "Responsive Design", status: "recommended" },
    { topic: "TypeScript", status: "recommended" },
    { topic: "React", status: "recommended" },
    { topic: "State Management (Redux / Zustand)", status: "recommended" },
    { topic: "Next.js (App Router)", status: "recommended" },
    { topic: "Testing (Jest, Cypress)", status: "optional" },
    { topic: "Performance Optimization", status: "optional" },
    { topic: "Web Accessibility (a11y)", status: "optional" },
  ],
  backend: [
    { topic: "Node.js & Express", status: "recommended" },
    { topic: "REST API Design", status: "recommended" },
    { topic: "Databases (PostgreSQL / MongoDB)", status: "recommended" },
    { topic: "ORM (Prisma / Mongoose)", status: "recommended" },
    { topic: "Authentication & Authorization", status: "recommended" },
    { topic: "GraphQL", status: "optional" },
    { topic: "Docker", status: "recommended" },
    { topic: "Message Queues (Redis / RabbitMQ)", status: "optional" },
    { topic: "Microservices Architecture", status: "optional" },
    { topic: "Monitoring & Logging", status: "optional" },
  ],
  devops: [
    { topic: "Linux Fundamentals", status: "recommended" },
    { topic: "Git & GitHub", status: "recommended" },
    { topic: "Docker & Docker Compose", status: "recommended" },
    { topic: "CI/CD (GitHub Actions)", status: "recommended" },
    { topic: "Cloud (AWS / GCP / Azure)", status: "recommended" },
    { topic: "Kubernetes", status: "optional" },
    { topic: "Infrastructure as Code (Terraform)", status: "optional" },
    { topic: "Monitoring (Prometheus / Grafana)", status: "optional" },
    { topic: "Security Best Practices", status: "recommended" },
    { topic: "Networking Fundamentals", status: "optional" },
  ],
};

export default function RoadmapPage() {
  const [activePath, setActivePath] = useState<PathKey>("frontend");

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{content.roadmap.heading.th}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.roadmap.heading.en}</p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-10">
          {(Object.keys(roadmapData) as PathKey[]).map((path) => (
            <button
              key={path}
              onClick={() => setActivePath(path)}
              className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all",
                activePath === path
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {content.roadmap.paths[path].th}
            </button>
          ))}
        </div>

        {/* Roadmap nodes */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-4">
            {roadmapData[activePath].map((node, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 border-2",
                  node.status === "recommended"
                    ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800"
                    : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                )}>
                  {node.status === "recommended" ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className={cn(
                  "flex-1 p-4 rounded-xl border",
                  node.status === "recommended"
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{node.topic}</span>
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      node.status === "recommended"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    )}>
                      {node.status === "recommended" ? "แนะนำ" : "ตัวเลือก"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
