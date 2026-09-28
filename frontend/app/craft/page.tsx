"use client";

import React, { useState, useMemo, useSyncExternalStore, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  Mail,
  Download,
  RotateCcw,
  Sliders,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileText,
  Sun,
  Moon,
  CheckCircle2,
  Building2,
  ChevronDown,
  Layers,
  Edit3,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import {
  TargetRecipient,
  TonePreset,
  BrevityMode,
  EmailAngle,
  DEFAULT_EXTRACTED_METRICS,
  DEFAULT_TECH_STACK,
  generateCraftedEmails,
} from "@/lib/emailGenerator";

function CraftStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  // Resume metadata from session store using useSyncExternalStore (React 19 compliant, SSR safe)
  const rawStored = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" ? sessionStorage.getItem("pitchcraft_data") || "" : ""),
    () => ""
  );

  const sessionData = useMemo(() => {
    if (!rawStored) return null;
    try {
      return JSON.parse(rawStored);
    } catch {
      return null;
    }
  }, [rawStored]);

  // Initial values from search params or session store
  const initialCompany =
    searchParams.get("company") ||
    sessionData?.targetCompany ||
    "Linear — Senior Product Engineer";

  const initialRecipient =
    (searchParams.get("recipient") as TargetRecipient) ||
    sessionData?.recipient ||
    "founder";

  const initialTone =
    (searchParams.get("tone") as TonePreset) ||
    sessionData?.tone ||
    "punchy";

  const initialAngle: EmailAngle =
    initialRecipient === "eng_manager"
      ? "eng_lead"
      : initialRecipient === "recruiter"
      ? "recruiter"
      : "founder";

  // State
  const [companyInput, setCompanyInput] = useState(initialCompany);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [recipient, setRecipient] = useState<TargetRecipient>(initialRecipient);
  const [tone, setTone] = useState<TonePreset>(initialTone);
  const [brevity, setBrevity] = useState<BrevityMode>("standard");
  const [activeAngle, setActiveAngle] = useState<EmailAngle>(initialAngle);
  const [showHighlights, setShowHighlights] = useState(true);
  const [copied, setCopied] = useState(false);
  const [subjectCopied, setSubjectCopied] = useState(false);
  const [showAltSubjects, setShowAltSubjects] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Resume metadata
  const fileName = sessionData?.fileName || "Alex_Chen_Staff_Engineer_Resume.pdf";
  const fileSize = sessionData?.fileSize || "248 KB";

  // Editable body state override
  const [customBodyOverride, setCustomBodyOverride] = useState<string | null>(null);

  // Generate dynamic email sets based on company, tone, brevity
  const generatedEmails = generateCraftedEmails(
    companyInput,
    recipient,
    tone,
    brevity,
    "Alex Chen"
  );

  const currentEmail = generatedEmails[activeAngle];

  // Derived company and role
  const parts = companyInput.split("—");
  const displayCompany = parts[0]?.trim() || "Linear";
  const displayRole = parts[1]?.trim() || "Product Engineer";

  // Copy full email text
  const handleCopyFullEmail = () => {
    const emailText = customBodyOverride || [
      `Subject: ${currentEmail.subject}`,
      ``,
      currentEmail.greeting,
      ``,
      currentEmail.intro,
      ``,
      currentEmail.bodyProof,
      ``,
      currentEmail.bodyPitch,
      ``,
      currentEmail.cta,
      ``,
      currentEmail.signoff,
    ].join("\n");

    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Copy subject only
  const handleCopySubject = (subj: string) => {
    navigator.clipboard.writeText(subj);
    setSubjectCopied(true);
    setTimeout(() => setSubjectCopied(false), 2000);
  };

  // Mailto link for Gmail/Default Client
  const getMailtoLink = () => {
    const subject = encodeURIComponent(currentEmail.subject);
    const body = encodeURIComponent(
      customBodyOverride ||
        `${currentEmail.greeting}\n\n${currentEmail.intro}\n\n${currentEmail.bodyProof}\n\n${currentEmail.bodyPitch}\n\n${currentEmail.cta}\n\n${currentEmail.signoff}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  // Download TXT pitch
  const handleDownloadTxt = () => {
    const content = [
      `PITCHCRAFT AI — CRAFTED OUTREACH`,
      `Target: ${displayCompany} (${displayRole})`,
      `Angle: ${currentEmail.tabLabel}`,
      `Tone: ${tone.toUpperCase()}`,
      `----------------------------------------`,
      `Subject: ${currentEmail.subject}`,
      ``,
      currentEmail.greeting,
      ``,
      currentEmail.intro,
      ``,
      currentEmail.bodyProof,
      ``,
      currentEmail.bodyPitch,
      ``,
      currentEmail.cta,
      ``,
      currentEmail.signoff,
      ``,
      `----------------------------------------`,
      `Alternative Subjects:`,
      ...currentEmail.subjectAlternatives.map((s, i) => `  ${i + 1}. ${s}`),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${displayCompany}_Cold_Email_${activeAngle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Simulate prompt refine
  const handleApplyCustomPrompt = () => {
    if (!customPrompt.trim()) return;
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setCustomPrompt("");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 dark:bg-[#0c0d12] dark:text-stone-100 relative selection:bg-stone-200 dark:selection:bg-stone-800 flex flex-col transition-colors duration-200">
      {/* Background ambient subtle pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#fbfbf9]/80 dark:bg-[#0c0d12]/80 backdrop-blur-lg border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Back Link & Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </Link>

            <span className="text-stone-300 dark:text-stone-700">/</span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-950 flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-stone-900 dark:text-white">
                PitchCraft
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded">
                AI
              </span>
            </div>
          </div>

          {/* Center: Live Status Indicator */}
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 text-xs font-medium text-stone-600 dark:text-stone-300 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pitches Formulated</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-stone-500 dark:text-stone-400">Grounded in CV Metrics</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all cursor-pointer"
              title={`Toggle ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">New Resume</span>
            </button>

            <button
              onClick={handleCopyFullEmail}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Flow */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 flex-1">
        {/* CONTEXT & EXTRACTION SNAPSHOT CARD */}
        <section className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Scan Complete
                </span>
                <span>•</span>
                <span>{fileName} ({fileSize})</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Cold Emails for {displayCompany}
              </h1>

              <div className="flex items-center gap-2 mt-1.5 text-sm text-stone-500 dark:text-stone-400">
                <span>Target role:</span>
                {!isEditingCompany ? (
                  <span className="font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                    {displayRole}
                    <button
                      onClick={() => setIsEditingCompany(true)}
                      className="text-xs text-stone-400 hover:text-stone-900 dark:hover:text-white underline underline-offset-2 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit target
                    </button>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={companyInput}
                      onChange={(e) => setCompanyInput(e.target.value)}
                      placeholder="Company — Role"
                      className="px-3 py-1 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => setIsEditingCompany(false)}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-xs font-medium cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Extracted Facts Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-medium text-stone-800 dark:text-stone-200">4 Metrics Isolated</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-medium text-stone-800 dark:text-stone-200">8 Tech Stack Skills</span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-stone-800 dark:text-stone-200">Zero Retention</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE: TWO-COLUMN STUDIO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: THE EMAIL COMPOSER & ANGLE SELECTOR (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ANGLE TABS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  { id: "founder", label: "Founder Pitch", badge: "< 85w", icon: Sparkles },
                  { id: "eng_lead", label: "Eng Lead", badge: "Technical", icon: Building2 },
                  { id: "recruiter", label: "Talent & ATS", badge: "Role Fit", icon: UserCheckIcon },
                  { id: "follow_up", label: "Follow-Up", badge: "Day 4 Touch", icon: Layers },
                ] as const
              ).map((tab) => {
                const isActive = activeAngle === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveAngle(tab.id);
                      setCustomBodyOverride(null);
                      if (tab.id === "founder") setRecipient("founder");
                      else if (tab.id === "eng_lead") setRecipient("eng_manager");
                      else if (tab.id === "recruiter") setRecipient("recruiter");
                    }}
                    className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isActive
                        ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-xs"
                        : "bg-white/70 hover:bg-stone-50 dark:bg-[#12141c]/70 dark:hover:bg-stone-900/60 border-stone-200/80 dark:border-stone-800/80 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold">{tab.label}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        isActive ? "text-stone-300 dark:text-stone-600" : "text-stone-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* THE CRAFTED EMAIL CARD */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#0e1017] shadow-sm overflow-hidden transition-all">
              {/* Studio Window Bar */}
              <div className="border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#12141c]/70 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {currentEmail.recipientTitle}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono">
                    {currentEmail.stats.replyRate} Est. Reply
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono">
                    {currentEmail.stats.wordCount} words
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHighlights(!showHighlights)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                      showHighlights
                        ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-xs"
                        : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-transparent hover:bg-stone-200/70"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showHighlights ? "Proof Highlighted" : "Highlight Proof"}</span>
                  </button>

                  <button
                    onClick={() => setIsEditingBody(!isEditingBody)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200/70 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingBody ? "Preview Mode" : "Edit Text"}</span>
                  </button>
                </div>
              </div>

              {/* SUBJECT LINE BAR */}
              <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800/60 bg-stone-50/40 dark:bg-[#12141c]/30">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 font-semibold shrink-0">
                      Subject:
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-stone-900 dark:text-white tracking-tight truncate">
                      {currentEmail.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopySubject(currentEmail.subject)}
                      title="Copy subject line"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      {subjectCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => setShowAltSubjects(!showAltSubjects)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-stone-600 dark:text-stone-300 bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300/70 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      <span>3 Alternatives</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          showAltSubjects ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Alternative subjects drawer */}
                {showAltSubjects && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                      Click to copy alternative:
                    </span>
                    {currentEmail.subjectAlternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleCopySubject(alt)}
                        className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-800 dark:text-stone-200 hover:border-stone-400 dark:hover:border-stone-600 transition-colors cursor-pointer flex items-center justify-between gap-3"
                      >
                        <span className="font-mono text-stone-400 text-[11px]">#{idx + 1}</span>
                        <span className="flex-1 truncate">{alt}</span>
                        <Copy className="w-3 h-3 text-stone-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EMAIL BODY WINDOW */}
              <div className="p-6 sm:p-8 space-y-5 text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed bg-white dark:bg-[#0e1017]">
                {isEditingBody ? (
                  <div className="space-y-3">
                    <textarea
                      rows={12}
                      value={
                        customBodyOverride !== null
                          ? customBodyOverride
                          : `${currentEmail.greeting}\n\n${currentEmail.intro}\n\n${currentEmail.bodyProof}\n\n${currentEmail.bodyPitch}\n\n${currentEmail.cta}\n\n${currentEmail.signoff}`
                      }
                      onChange={(e) => setCustomBodyOverride(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-sm leading-relaxed text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white font-sans"
                    />
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Direct editing mode active</span>
                      <button
                        onClick={() => setCustomBodyOverride(null)}
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-white underline cursor-pointer"
                      >
                        Reset to Original
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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
                    <div className="pt-3 text-stone-500 dark:text-stone-400 whitespace-pre-line text-sm">
                      {currentEmail.signoff}
                    </div>
                  </>
                )}
              </div>

              {/* HIGHLIGHT LEGEND BAR */}
              {showHighlights && !isEditingBody && (
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
                  <span className="text-[11px] font-mono text-stone-400">
                    {currentEmail.highlightNotes}
                  </span>
                </div>
              )}

              {/* ACTION TOOLBAR FOOTER */}
              <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800/60 bg-white dark:bg-[#0e1017] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentEmail.stats.readTime} read time</span>
                  <span>•</span>
                  <span>{currentEmail.stats.spamScore}</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                    <span>Export .txt</span>
                  </button>

                  <a
                    href={getMailtoLink()}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>Send in Email</span>
                  </a>

                  <button
                    onClick={handleCopyFullEmail}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Cold Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: REAL-TIME CALIBRATION & PROOF INSPECTOR (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* TONE & BREVITY CALIBRATOR CARD */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800/60">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-stone-500" />
                  Calibrate Outreach
                </h3>
                <span className="text-xs font-mono text-stone-400">Real-time</span>
              </div>

              {/* Tone Preset Buttons */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-300 mb-2 block">
                  Tone Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "punchy", label: "Crisp" },
                    { id: "metric_heavy", label: "Metrics" },
                    { id: "conversational", label: "Warm" },
                  ].map((t) => {
                    const isSelected = tone === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTone(t.id as TonePreset);
                          setCustomBodyOverride(null);
                        }}
                        className={`py-2 px-2 rounded-xl text-center text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white font-semibold shadow-xs"
                            : "bg-white hover:bg-stone-50 dark:bg-[#0e1017] dark:hover:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brevity Buttons */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-300 mb-2 block">
                  Length / Brevity
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "ultra_short", label: "< 60w" },
                    { id: "standard", label: "Standard" },
                    { id: "detailed", label: "~110w" },
                  ].map((b) => {
                    const isSelected = brevity === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          setBrevity(b.id as BrevityMode);
                          setCustomBodyOverride(null);
                        }}
                        className={`py-2 px-2 rounded-xl text-center text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white font-semibold shadow-xs"
                            : "bg-white hover:bg-stone-50 dark:bg-[#0e1017] dark:hover:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prompt Instructions */}
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-300 mb-2 block">
                  Custom Refinement Note
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. emphasize Kafka & Go"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#0e1017] border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-stone-900 dark:focus:border-white"
                  />
                  <button
                    disabled={isRegenerating || !customPrompt.trim()}
                    onClick={handleApplyCustomPrompt}
                    className="px-3 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shrink-0"
                  >
                    {isRegenerating ? "Tuning..." : "Refine"}
                  </button>
                </div>
              </div>
            </div>

            {/* EXTRACTED RESUME PROOF INSPECTOR */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800/60">
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-stone-500" />
                  Extracted Proof Facts
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Verified PDF
                </span>
              </div>

              <div className="space-y-3">
                {DEFAULT_EXTRACTED_METRICS.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-stone-50/80 dark:bg-[#0e1017]/80 border border-stone-200/60 dark:border-stone-800/60 text-xs space-y-1"
                  >
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {item.metric}
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 leading-snug">
                      {item.context}
                    </div>
                  </div>
                ))}
              </div>

              {/* Matched Stack Tags */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                  Key Skills Detected
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_TECH_STACK.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800/60 text-[11px] font-mono text-stone-700 dark:text-stone-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* MULTI-TOUCH SEQUENCE ROADMAP */}
            <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-stone-500" />
                Recommended Send Cadence
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50/80 dark:bg-[#0e1017]/80 border border-stone-200/60 dark:border-stone-800/60">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-white">
                      Day 1: The Initial Hook
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 mt-0.5">
                      Send Tuesday or Thursday morning at 8:30 AM recipient time.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50/80 dark:bg-[#0e1017]/80 border border-stone-200/60 dark:border-stone-800/60">
                  <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-white">
                      Day 4: Un-gated Value Artifact
                    </div>
                    <div className="text-stone-500 dark:text-stone-400 mt-0.5">
                      Switch to Angle 4 (Follow-up) with a short Loom demo or benchmark repo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// UserCheck icon helper
function UserCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

// Suspense wrapper for Next.js App Router useSearchParams
export default function CraftPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbf9] dark:bg-[#0c0d12] flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Formulating your cold emails...</span>
          </div>
        </div>
      }
    >
      <CraftStudio />
    </Suspense>
  );
}
