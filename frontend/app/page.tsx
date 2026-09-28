"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ResumeUploadSection, {
  UploadedFileState,
  TargetRecipient,
  TonePreset,
} from "@/components/ResumeUploadSection";
import EmailPreviewSection from "@/components/EmailPreviewSection";
import StatsStrip from "@/components/StatsStrip";
import ComparisonSection from "@/components/ComparisonSection";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFileState | null>(null);
  const [recipient, setRecipient] = useState<TargetRecipient>("founder");
  const [targetCompany, setTargetCompany] = useState("Linear — Senior Product Engineer");
  const [tone, setTone] = useState<TonePreset>("punchy");
  const [sampleTrigger, setSampleTrigger] = useState(0);

  const handleScanComplete = (
    file: UploadedFileState,
    rec: TargetRecipient,
    company: string,
    t: TonePreset
  ) => {
    setUploadedFile(file);
    setRecipient(rec);
    if (company) setTargetCompany(company);
    setTone(t);

    const targetComp = company || "Linear — Senior Product Engineer";

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "pitchcraft_data",
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          isSample: file.isSample,
          recipient: rec,
          targetCompany: targetComp,
          tone: t,
          backendResponse: file.backendResponse,
        })
      );
    }

    // Take them directly to the crafted email page
    setTimeout(() => {
      router.push(
        `/craft?company=${encodeURIComponent(targetComp)}&recipient=${rec}&tone=${t}`
      );
    }, 450);
  };

  const handleLoadSample = () => {
    setSampleTrigger((prev) => prev + 1);
    const uploadElement = document.getElementById("upload-section");
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToUpload = () => {
    const uploadElement = document.getElementById("upload-section");
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 dark:bg-[#0c0d12] dark:text-stone-100 relative selection:bg-stone-200 dark:selection:bg-stone-800 flex flex-col transition-colors duration-200">
      {/* Background ambient subtle grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar onLoadSample={handleLoadSample} onScrollToUpload={handleScrollToUpload} />

      {/* Main Spacious Flow Container */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col flex-1 gap-20 sm:gap-28 py-10 sm:py-16">
        {/* HERO SECTION */}
        <section className="relative pt-8 pb-4 sm:pt-16 sm:pb-8 text-center flex flex-col items-center justify-center">
          {/* Subtle Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm text-xs font-medium text-stone-600 dark:text-stone-300 shadow-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cold Outreach Engine</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-stone-500 dark:text-stone-400">PDF to founder-ready pitches</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Turn your resume into cold emails that{" "}
            <span className="underline decoration-stone-300 dark:decoration-stone-700 underline-offset-8">
              founders answer.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Stop blasting copy-pasted templates. PitchCraft extracts your verified metrics and achievements
            to craft role-tailored outreach in 15 seconds.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleScrollToUpload}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-stone-50 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span>Scan Resume & Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Try Sample Resume First</span>
            </button>
          </div>

          {/* Proof Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>4.8x Higher Reply Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>&lt; 90 Words (Mobile-Ready)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero AI Fluff</span>
            </div>
          </div>
        </section>

        {/* CORE RESUME UPLOAD SCANNER (The Centerpiece) */}
        <ResumeUploadSection
          onScanComplete={handleScanComplete}
          externalSampleTrigger={sampleTrigger}
        />

        {/* LIVE GENERATED COLD EMAIL OUTPUT SHOWCASE */}
        <EmailPreviewSection
          uploadedFile={uploadedFile}
          recipient={recipient}
          targetCompany={targetCompany}
          tone={tone}
        />

        {/* PROOF STATS STRIP */}
        <StatsStrip />

        {/* WHY GENERIC OUTREACH FAILS VS PITCHCRAFT */}
        <ComparisonSection />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* WHY PITCHCRAFT CONVERTS */}
        <FeaturesSection />

        {/* FAQ SECTION */}
        <FaqSection />

        {/* BOTTOM CONVERSION CTA CARD */}
        <section className="w-full max-w-5xl mx-auto">
          <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-gradient-to-b from-stone-50/90 to-white dark:from-stone-900/40 dark:to-[#12141c]/80 backdrop-blur-sm p-10 sm:p-16 text-center shadow-sm space-y-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight max-w-xl mx-auto">
              Ready to Book Interviews at Top Tech Companies?
            </h2>

            <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
              Upload your resume now and generate customized, metric-heavy cold emails tailored to hiring managers.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleScrollToUpload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-stone-50 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <FileText className="w-4 h-4 text-inherit" />
                <span>Upload Resume & Start Free</span>
                <ArrowRight className="w-4 h-4 text-inherit" />
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Try Sample Resume First</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
