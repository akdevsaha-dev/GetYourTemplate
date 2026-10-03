"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Clock,
  Eye,
  TrendingUp,
} from "lucide-react";
import { TargetRecipient, TonePreset, UploadedFileState } from "./ResumeUploadSection";

type EmailAngle = "founder" | "eng_lead" | "follow_up";

interface EmailPreviewSectionProps {
  uploadedFile?: UploadedFileState | null;
  recipient?: TargetRecipient;
  targetCompany?: string;
  tone?: TonePreset;
}

export default function EmailPreviewSection({
  targetCompany = "Linear — Product Engineer",
}: EmailPreviewSectionProps) {
  const [activeTab, setActiveTab] = useState<EmailAngle>("founder");
  const [copied, setCopied] = useState(false);
  const [showHighlights, setShowHighlights] = useState(true);

  const companyName = targetCompany ? targetCompany.split("—")[0].trim() : "Linear";
  const roleName = targetCompany.includes("—") ? targetCompany.split("—")[1].trim() : "Founding Engineer";

  const emailVariations = {
    founder: {
      title: "Angle 1: The Founder Hook",
      recipientType: "Founder / CEO",
      stats: { replyRate: "42%", wordCount: 78, readTime: "18s" },
      subject: `Quick thought on ${companyName}'s realtime sync & latency`,
      greeting: `Hi ${companyName} Team,`,
      intro: `Saw your recent changelog post about scaling ${companyName}'s collaborative sync engine. Really clean approach to conflict resolution.`,
      bodyProof: `Over the past 3 years as Staff Engineer at Series B startup, I re-architected our distributed event pipeline, cutting p99 query latency from 850ms to 45ms across 12M daily active sessions (TypeScript/Go/PostgreSQL).`,
      bodyPitch: `I've been mapping out a couple architectural patterns that could eliminate edge cold-starts for your offline-first cache.`,
      cta: `Open to a 5-minute async Loom or a quick sync next Tuesday to see if it's relevant to what you're building?`,
      signoff: `Best,\nAlex Chen\ngithub.com/[your-github] • [your-email@domain.com]`,
      highlightNotes: "Extracted: +43% latency reduction, Go/TypeScript stack, Series B experience",
    },
    eng_lead: {
      title: "Angle 2: The Tech Lead Deep-Dive",
      recipientType: "VP of Engineering",
      stats: { replyRate: "39%", wordCount: 94, readTime: "24s" },
      subject: `Question regarding ${companyName}'s event bus & distributed cache`,
      greeting: `Hi ${companyName} Engineering Team,`,
      intro: `Was digging into ${companyName}'s engineering blog post on local-first database replication. Appreciated how you handled optimistic UI rollbacks.`,
      bodyProof: `At my previous team, I led our migration to an event-driven architecture using Kafka & Go, reducing multi-region database replication lag by 68% while handling 14,000 peak writes/sec.`,
      bodyPitch: `Saw you're expanding the Core Infrastructure team for ${roleName}. I've spent the last 4 years solving exactly these edge synchronization challenges.`,
      cta: `Would love to share our benchmark learnings if you have 10 mins this week. Are you free Thursday morning?`,
      signoff: `Cheers,\nAlex Chen\nResume attached: [resume.pdf]`,
      highlightNotes: "Extracted: -68% replication lag, Kafka/Go, 14,000 writes/sec metric",
    },
    follow_up: {
      title: "Angle 3: The Day 4 Value Follow-Up",
      recipientType: "Multi-Touch Cadence",
      stats: { replyRate: "28%", wordCount: 58, readTime: "12s" },
      subject: `Re: Quick thought on ${companyName}'s realtime sync`,
      greeting: `Hi ${companyName} Team,`,
      intro: `Know your inbox is packed with the new release launch this week.`,
      bodyProof: `Put together a 60-second Loom repo reproduction showing how we handled SQLite WASM worker threads with zero main-thread jank at my last role.`,
      bodyPitch: `Here's the link: loom.com/share/alex-chen-wasm-demo`,
      cta: `No response needed if you're swamped — just thought your infra team might find the benchmark benchmarks handy.`,
      signoff: `Alex`,
      highlightNotes: "Follow-up angle: Zero guilt, provides immediate un-gated value",
    },
  };

  const currentEmail = emailVariations[activeTab];

  const handleCopy = () => {
    const fullText = `Subject: ${currentEmail.subject}\n\n${currentEmail.greeting}\n\n${currentEmail.intro}\n\n${currentEmail.bodyProof}\n\n${currentEmail.bodyPitch}\n\n${currentEmail.cta}\n\n${currentEmail.signoff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="live-preview" className="w-full max-w-5xl mx-auto scroll-mt-24">
      {/* Standalone Elegant Showcase Card */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 sm:p-10 lg:p-12 shadow-sm space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
              Generated Cold Outreach
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              Grounded in verified experience — structured for high reply rates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                showHighlights
                  ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-xs"
                  : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-transparent hover:bg-stone-200/70 dark:hover:bg-stone-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showHighlights ? "Proof Highlighted" : "Highlight Proof"}</span>
            </button>
          </div>
        </div>

        {/* Main Email Window */}
        <div className="rounded-2xl bg-white dark:bg-[#0e1017] border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-colors">
          {/* Card Window Bar */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#12141c]/70 px-4 sm:px-6 py-3.5 flex-wrap gap-3">
            {/* Email Angle Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-200/60 dark:bg-stone-800/60">
              {[
                { id: "founder", label: "Founder Pitch", badge: "Short" },
                { id: "eng_lead", label: "Engineering Lead", badge: "Tech" },
                { id: "follow_up", label: "Day 4 Follow-Up", badge: "Value" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as EmailAngle)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-stone-900 dark:bg-[#0e1017] dark:text-white shadow-xs font-semibold"
                        : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`hidden sm:inline text-[10px] ${
                        isActive ? "text-stone-400 dark:text-stone-500" : "text-stone-400"
                      }`}
                    >
                      ({tab.badge})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-stone-50 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          {/* Email Metadata / Stat Header */}
          <div className="px-6 py-3 bg-stone-50/40 dark:bg-[#12141c]/30 border-b border-stone-100 dark:border-stone-800/60 flex items-center justify-between flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2.5">
              <span className="text-stone-400">Target:</span>
              <span className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium capitalize">
                {currentEmail.recipientType}
              </span>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <span className="text-stone-400">Company:</span>
              <span className="text-stone-900 dark:text-stone-100 font-medium">{companyName}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                {currentEmail.stats.replyRate} Est. Reply Rate
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {currentEmail.stats.readTime} read ({currentEmail.stats.wordCount} words)
              </span>
            </div>
          </div>

          {/* Email Body Content Window */}
          <div className="p-6 sm:p-8 space-y-5 text-sm text-stone-800 dark:text-stone-200 leading-relaxed bg-white dark:bg-[#0e1017]">
            {/* Subject Line Bar */}
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100 dark:border-stone-800/60">
              <span className="text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold shrink-0">
                Subject:
              </span>
              <span className="font-semibold text-stone-900 dark:text-white tracking-tight">
                {currentEmail.subject}
              </span>
            </div>

            {/* Salutation */}
            <div>{currentEmail.greeting}</div>

            {/* Hook paragraph */}
            <p>
              {showHighlights ? (
                <span className="bg-sky-500/10 text-sky-950 dark:text-sky-200 border-b border-sky-400/40 px-1.5 py-0.5 rounded-md transition-colors">
                  {currentEmail.intro}
                </span>
              ) : (
                currentEmail.intro
              )}
            </p>

            {/* The Proof (Extracted from Resume) */}
            <p>
              {showHighlights ? (
                <span className="bg-amber-500/10 text-amber-950 dark:text-amber-200 border-b border-amber-400/40 px-1.5 py-0.5 rounded-md transition-colors">
                  {currentEmail.bodyProof}
                </span>
              ) : (
                currentEmail.bodyProof
              )}
            </p>

            {/* Pitch & Value Proposition */}
            <p>{currentEmail.bodyPitch}</p>

            {/* Low Friction CTA */}
            <p className="font-medium">
              {showHighlights ? (
                <span className="bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 border-b border-emerald-400/40 px-1.5 py-0.5 rounded-md transition-colors">
                  {currentEmail.cta}
                </span>
              ) : (
                currentEmail.cta
              )}
            </p>

            {/* Signoff */}
            <div className="pt-3 text-stone-500 dark:text-stone-400 whitespace-pre-line text-xs">
              {currentEmail.signoff}
            </div>
          </div>

          {/* Legend / Key Footer */}
          {showHighlights && (
            <div className="px-6 py-3.5 bg-stone-50/70 dark:bg-[#12141c]/70 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-5 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span>Company Hook</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Resume Proof Metric</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Low-Friction CTA</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
