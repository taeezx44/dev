import { content } from "@/lib/content";
import CodeEditor from "@/components/playground/CodeEditor";

export const metadata = { title: "Playground | DevAcademy" };

export default function PlaygroundPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{content.playground.heading.th}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.playground.heading.en}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}
