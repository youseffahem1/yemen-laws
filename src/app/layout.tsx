import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Amiri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CinematicIntro } from "@/components/CinematicIntro";
import { ReadingControls } from "@/components/ReadingControls";
import { getCurrentUser } from "@/lib/auth";

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "الموسوعة القانونية والقضائية اليمنية | Yemen Legal & Judicial Encyclopedia",
  description:
    "منصة قانونية وقضائية رقمية متكاملة تتيح الوصول إلى الدستور والقوانين اليمنية والمواد التشريعية والمبادئ القضائية والأحكام الموثقة.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ar" dir="rtl" className={`${ibmArabic.variable} ${amiri.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#FAF8F4] text-[#1E2430] antialiased">
        <CinematicIntro />
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <ReadingControls />
        <Footer />
      </body>
    </html>
  );
}
