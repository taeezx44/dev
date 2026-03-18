"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import Button from "@/components/ui/Button";
import { Play, Loader2 } from "lucide-react";
import { content } from "@/lib/content";

const defaultCode: Record<string, string> = {
  JavaScript: `// Welcome to DevAcademy Playground! 🚀
// ลองเขียนโค้ด JavaScript ที่นี่

function greet(name) {
  console.log(\`สวัสดี \${name}! ยินดีต้อนรับสู่ DevAcademy\`);
}

greet("World");

// ลองเพิ่มโค้ดของคุณด้านล่าง
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);
`,
  Python: `# Welcome to DevAcademy Playground! 🚀

def greet(name):
    print(f"สวัสดี {name}! ยินดีต้อนรับ")

greet("World")
`,
  Go: `// Welcome to DevAcademy Playground! 🚀

package main

import "fmt"

func main() {
    fmt.Println("สวัสดี World! ยินดีต้อนรับ")
}
`,
  "C#": `// Welcome to DevAcademy Playground! 🚀
using System;

class Program {
    static void Main() {
        Console.WriteLine("สวัสดี World! ยินดีต้อนรับสู่ C#");
    }
}
`,
  "C++": `// Welcome to DevAcademy Playground! 🚀
#include <iostream>

int main() {
    std::cout << "สวัสดี World! ยินดีต้อนรับสู่ C++" << std::endl;
    return 0;
}
`,
  HTML: `<!-- Welcome to DevAcademy Playground! 🚀 -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f8fafc;
      color: #0f172a;
    }
    h1 { color: #2563eb; }
    button {
      padding: 10px 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <h1>ยินดีต้อนรับสู่ HTML Playground! 🌐</h1>
  <p>ลองแก้ไขโค้ดและกดรันเพื่อดูผลลัพธ์</p>
  <button onclick="alert('สวัสดีจาก HTML!')">คลิกฉัน</button>
</body>
</html>
`,
};

const languageMap: Record<string, string> = {
  JavaScript: "javascript",
  Python: "python",
  Go: "go",
  "C#": "csharp",
  "C++": "cpp",
  HTML: "html",
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(defaultCode["JavaScript"]);
  const [output, setOutput] = useState("");
  const [htmlPreview, setHtmlPreview] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    setHtmlPreview("");

    if (language === "HTML") {
      setHtmlPreview(code);
      setRunning(false);
      return;
    }

    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();
      if (data.error && !data.output) {
         setOutput("Error: " + data.error);
      } else {
         setOutput(data.output || "No output");
      }
    } catch {
      setOutput("Error: Failed to execute code");
    } finally {
      setRunning(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    if (running) return;
    setLanguage(lang);
    setCode(defaultCode[lang]);
    setOutput("");
    setHtmlPreview("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl gap-3">
        <div className="flex flex-wrap gap-2">
          {content.playground.languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                language === lang
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <Button onClick={handleRun} size="sm" disabled={running}>
          {running ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-1" />
          )}
          {content.playground.run.th}
        </Button>
      </div>

      {/* Editor */}
      <div className="w-full h-[400px] md:h-[500px]">
        <Editor
          height="100%"
          language={languageMap[language]}
          value={code}
          onChange={(v) => setCode(v || "")}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              กำลังโหลดตัวเขียนโค้ด (รอสักครู่)...
            </div>
          }
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: true,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output */}
      <div className="border-t border-slate-200 dark:border-slate-700 flex flex-col min-h-[160px] max-h-[300px]">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {content.playground.output.th} / {content.playground.output.en}
          </span>
        </div>
        
        <div className="flex-1 overflow-auto rounded-b-2xl bg-white dark:bg-slate-900">
          {language === "HTML" && htmlPreview ? (
            <iframe
              title="HTML Preview"
              srcDoc={htmlPreview}
              className="w-full h-full min-h-[250px] border-none bg-white"
              sandbox="allow-scripts"
            />
          ) : (
            <pre className="p-4 bg-slate-900 text-green-400 text-sm font-mono whitespace-pre-wrap min-h-[120px]">
              {output || "// ผลลัพธ์จะแสดงที่นี่"}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

