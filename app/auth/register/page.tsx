import RegisterForm from "@/components/auth/RegisterForm";
import { content } from "@/lib/content";

export const metadata = { title: "สมัครสมาชิก | DevAcademy" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{content.auth.register.title.th}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{content.auth.register.title.en}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
