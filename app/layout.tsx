import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sarabun = Sarabun({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "DevAcademy | แพลตฟอร์มเรียนรู้การเขียนโปรแกรม",
  description:
    "แพลตฟอร์มเรียนรู้การเขียนโปรแกรมออนไลน์ฟรี พร้อมหลักสูตร บทความ Playground และ Roadmap สำหรับนักพัฒนาทุกระดับ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${sarabun.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300`}
      >
        <Providers>
          <Navbar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
