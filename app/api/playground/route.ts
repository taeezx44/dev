import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = (command: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      resolve({ stdout: stdout || "", stderr: stderr || (error ? error.message : "") });
    });
  });
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, language } = await req.json();

    if (language === "HTML") {
      return NextResponse.json({ output: "HTML is processed on the client side." });
    }

    const tmpDir = os.tmpdir();
    const fileName = `code-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (language === "JavaScript" || language === "javascript") {
      const filePath = path.join(tmpDir, `${fileName}.js`);
      await fs.writeFile(filePath, code);
      try {
        const { stdout, stderr } = await execAsync(`node "${filePath}"`);
        await fs.unlink(filePath).catch(() => {});
        return NextResponse.json({ output: stderr ? `Error:\n${stderr}\n\nOutput:\n${stdout}` : stdout || "No output" });
      } catch (err: any) {
        return NextResponse.json({ output: `Error: ${err.message}` });
      }
    }

    if (language === "Python" || language === "python") {
      const filePath = path.join(tmpDir, `${fileName}.py`);
      await fs.writeFile(filePath, code);
      try {
        const { stdout, stderr } = await execAsync(`python "${filePath}"`);
        await fs.unlink(filePath).catch(() => {});
        return NextResponse.json({ output: stderr ? `Error:\n${stderr}\n\nOutput:\n${stdout}` : stdout || "No output" });
      } catch (err: any) {
        return NextResponse.json({ output: `Error: ${err.message}` });
      }
    }

    // Languages that need compilation or special environment setup
    return NextResponse.json({
      output: `⚠️ ${language} execution requires a dedicated compiler server and is mocked in this local environment.\n\nPlease use JavaScript or Python for local execution.`,
    });

  } catch (error) {
    console.error("Playground error:", error);
    return NextResponse.json({ 
        error: "Execution failed", 
        output: "มีข้อผิดพลาดบางอย่างเกิดขึ้นกับการรันโค้ด ขัดข้องชั่วคราว" 
    }, { status: 500 });
  }
}
