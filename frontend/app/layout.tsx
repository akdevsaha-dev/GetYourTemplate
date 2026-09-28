import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PitchCraft AI — Convert Your Resume into High-Converting Cold Emails",
  description:
    "Upload your resume PDF to extract metric-backed achievements and generate hyper-tailored cold outreach for hiring managers, founders, and recruiters.",
  keywords: [
    "cold email",
    "resume to cold email",
    "job search outreach",
    "personalized cold email",
    "founder pitch",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} dark scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#fbfbf9] text-stone-900 dark:bg-[#0c0d12] dark:text-stone-100 font-sans antialiased transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
