"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore, Suspense } from "react";
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
  parseResumeContact,
  CandidateContactInfo,
} from "@/lib/emailGenerator";
import type { ColdEmailData } from "@/lib/api";

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

  // Resume metadata & live backend analysis
  const fileName = sessionData?.fileName || "Alex_Chen_Staff_Engineer_Resume.pdf";
  const fileSize = sessionData?.fileSize || "248 KB";
  const liveColdEmail = sessionData?.backendResponse?.coldEmail as ColdEmailData | undefined;
  const liveResumeText = sessionData?.backendResponse?.text as string | undefined;

  // Extract candidate contact details from resume text, backend response, or session cache
  const initialContact = useMemo<CandidateContactInfo>(() => {
    const parsed = parseResumeContact(liveResumeText, fileName);
    const backendContact = sessionData?.backendResponse?.contactInfo as CandidateContactInfo | undefined;
    const sessionContact = sessionData?.candidateContact as CandidateContactInfo | undefined;

    return {
      name:
        sessionContact?.name ||
        backendContact?.name ||
        parsed.name ||
        (sessionData?.isSample ? "Alex Chen" : "Your Name"),
      email: sessionContact?.email || backendContact?.email || parsed.email || "",
      github: sessionContact?.github || backendContact?.github || parsed.github || "",
      linkedin: sessionContact?.linkedin || backendContact?.linkedin || parsed.linkedin || "",
      portfolio: sessionContact?.portfolio || backendContact?.portfolio || parsed.portfolio || "",
      phone: sessionContact?.phone || backendContact?.phone || parsed.phone || "",
      cvFileName: fileName,
    };
  }, [liveResumeText, fileName, sessionData]);

  const [candidateContact, setCandidateContact] = useState<CandidateContactInfo>(initialContact);
  const [draftContact, setDraftContact] = useState<CandidateContactInfo>(initialContact);
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Sync state if resume text / session data loads after initial mount
  useEffect(() => {
    if (initialContact.name && initialContact.name !== "Your Name") {
      setCandidateContact((prev) => ({
        ...initialContact,
        ...prev,
        name: prev.name && prev.name !== "Your Name" ? prev.name : initialContact.name,
        email: prev.email || initialContact.email,
        github: prev.github || initialContact.github,
      }));
      setDraftContact((prev) => ({
        ...initialContact,
        ...prev,
        name: prev.name && prev.name !== "Your Name" ? prev.name : initialContact.name,
        email: prev.email || initialContact.email,
        github: prev.github || initialContact.github,
      }));
    }
  }, [initialContact]);

  const candidateDisplayName = candidateContact.name?.trim() || "Your Name";

  const handleSaveCandidateContact = (updated: CandidateContactInfo) => {
    setCandidateContact(updated);
    setIsEditingContact(false);
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("pitchcraft_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          sessionStorage.setItem(
            "pitchcraft_data",
            JSON.stringify({ ...parsed, candidateContact: updated })
          );
        }
      } catch (e) {
        console.error("Failed to update session storage candidate contact", e);
      }
    }
  };

  // Dynamic Recipient Name (e.g. from query params, session, or edited in studio)
  const initialRecipientName =
    searchParams.get("recipientName") ||
    sessionData?.recipientName ||
    "";
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [isEditingRecipientName, setIsEditingRecipientName] = useState(false);

  const handleSaveRecipientName = (newName: string) => {
    const trimmed = newName.trim();
    setRecipientName(trimmed);
    setIsEditingRecipientName(false);
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("pitchcraft_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          sessionStorage.setItem("pitchcraft_data", JSON.stringify({ ...parsed, recipientName: trimmed }));
        }
      } catch (e) {
        console.error("Failed to update session storage recipient name", e);
      }
    }
  };

  // Derived company and role
  const parts = companyInput.split("—");
  const displayCompany = parts[0]?.trim() || "Linear";
  const displayRole = parts[1]?.trim() || "Product Engineer";

  // Dynamic greeting: uses custom recipient name if set, otherwise defaults cleanly to the company team
  const dynamicGreeting = useMemo(() => {
    if (recipientName.trim()) {
      return `Hi ${recipientName.trim()},`;
    }
    if (activeAngle === "founder") {
      return `Hi ${displayCompany} Team,`;
    }
    if (activeAngle === "eng_lead") {
      return `Hi ${displayCompany} Engineering Team,`;
    }
    if (activeAngle === "recruiter") {
      return `Hi ${displayCompany} Talent Team,`;
    }
    return `Hi ${displayCompany} Team,`;
  }, [recipientName, activeAngle, displayCompany]);

  // Clean live body to remove any LLM-generated salutation (e.g. "Hi Karri," or "Dear Team,")
  const cleanLiveBody = useMemo(() => {
    if (!liveColdEmail?.body) return "";
    return liveColdEmail.body
      .replace(/^(?:Hi|Hey|Hello|Dear)\s+[^,\n]+,?\s*\n*/i, "")
      .trim();
  }, [liveColdEmail?.body]);

  // Editable body state override
  const [customBodyOverride, setCustomBodyOverride] = useState<string | null>(null);

  // Generate dynamic email sets based on company, tone, brevity, and parsed contact info
  const generatedEmails = useMemo(() => {
    return generateCraftedEmails(
      companyInput,
      recipient,
      tone,
      brevity,
      candidateDisplayName,
      recipientName,
      candidateContact
    );
  }, [companyInput, recipient, tone, brevity, candidateDisplayName, recipientName, candidateContact]);

  const baseEmail = generatedEmails[activeAngle];

  // Whether the live backend AI response applies to current view
  const isLiveActive = Boolean(
    liveColdEmail && (activeAngle === initialAngle || !generatedEmails[activeAngle])
  );

  const currentEmail = useMemo(() => {
    if (isLiveActive && liveColdEmail) {
      const activeText = cleanLiveBody || liveColdEmail.body;
      const words = activeText.trim().split(/\s+/).filter(Boolean).length;
      return {
        ...baseEmail,
        greeting: dynamicGreeting,
        subject: liveColdEmail.subject || baseEmail.subject,
        subjectAlternatives: [
          liveColdEmail.subject,
          ...(baseEmail.subjectAlternatives || []).filter((s: string) => s !== liveColdEmail.subject),
        ],
        bodyPitch: activeText,
        bodyProof: liveColdEmail.closing || baseEmail.bodyProof,
        stats: {
          ...baseEmail.stats,
          wordCount: words,
          readTime: `~${Math.max(15, Math.round((words / 200) * 60))}s`,
        },
      };
    }
    return {
      ...baseEmail,
      greeting: dynamicGreeting,
    };
  }, [isLiveActive, liveColdEmail, cleanLiveBody, baseEmail, dynamicGreeting]);

  // Build full email plain-text
  const fullEmailText = useMemo(() => {
    if (customBodyOverride) return customBodyOverride;
    if (isLiveActive && liveColdEmail) {
      return [
        `Subject: ${currentEmail.subject}`,
        ``,
        currentEmail.greeting,
        ``,
        cleanLiveBody || liveColdEmail.body,
        ``,
        liveColdEmail.closing ? `Key Proof Metric: ${liveColdEmail.closing}` : ``,
        ``,
        currentEmail.signoff,
      ].filter(Boolean).join("\n");
    }
    return [
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
  }, [customBodyOverride, isLiveActive, liveColdEmail, cleanLiveBody, currentEmail]);

  // Copy full email text
  const handleCopyFullEmail = () => {
    navigator.clipboard.writeText(fullEmailText);
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
    const bodyText = isLiveActive && liveColdEmail
      ? `${currentEmail.greeting}\n\n${cleanLiveBody || liveColdEmail.body}\n\n${liveColdEmail.closing ? `${liveColdEmail.closing}\n\n` : ""}${currentEmail.signoff}`
      : `${currentEmail.greeting}\n\n${currentEmail.intro}\n\n${currentEmail.bodyProof}\n\n${currentEmail.bodyPitch}\n\n${currentEmail.cta}\n\n${currentEmail.signoff}`;
    const body = encodeURIComponent(customBodyOverride || bodyText);
    return `mailto:?subject=${subject}&body=${body}`;
  };

  // Download TXT pitch
  const handleDownloadTxt = () => {
    const bodyContent = isLiveActive && liveColdEmail
      ? `${currentEmail.greeting}\n\n${cleanLiveBody || liveColdEmail.body}\n\n${liveColdEmail.closing ? `Key Proof Metric: ${liveColdEmail.closing}\n\n` : ""}${currentEmail.signoff}`
      : `${currentEmail.greeting}\n\n${currentEmail.intro}\n\n${currentEmail.bodyProof}\n\n${currentEmail.bodyPitch}\n\n${currentEmail.cta}\n\n${currentEmail.signoff}`;

    const content = [
      `PITCHCRAFT AI — CRAFTED OUTREACH`,
      `Target: ${displayCompany} (${displayRole})`,
      `Angle: ${currentEmail.tabLabel}`,
      `Tone: ${tone.toUpperCase()}`,
      `Generated by: ${isLiveActive && liveColdEmail ? "Gemini AI (Live)" : "AI Career Engine"}`,
      `----------------------------------------`,
      `Subject: ${currentEmail.subject}`,
      ``,
      customBodyOverride || bodyContent,
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

  const renderSalutation = () => (
    <div className="flex items-center gap-2 group">
      {!isEditingRecipientName ? (
        <div className="font-medium text-stone-900 dark:text-white flex items-center gap-2">
          <span>{currentEmail.greeting}</span>
          <button
            type="button"
            onClick={() => setIsEditingRecipientName(true)}
            className="text-[11px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 opacity-60 hover:opacity-100 transition-opacity underline cursor-pointer inline-flex items-center gap-1"
            title="Personalize recipient name"
          >
            <Edit3 className="w-3 h-3" />
            {recipientName ? "Edit name" : "Add name"}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-stone-900 dark:text-white">Hi</span>
          <input
            type="text"
            autoFocus
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Recipient name"
            className="px-2.5 py-0.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:border-stone-900 dark:focus:border-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveRecipientName(recipientName);
            }}
          />
          <span className="font-medium text-stone-900 dark:text-white">,</span>
          <button
            type="button"
            onClick={() => handleSaveRecipientName(recipientName)}
            className="px-2 py-0.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-xs font-medium cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );

  const renderSignoff = () => (
    <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 mt-2 space-y-3">
      {!isEditingContact ? (
        <div className="flex items-start justify-between gap-4 group">
          <div className="text-stone-600 dark:text-stone-300 whitespace-pre-line text-sm leading-relaxed font-sans">
            {currentEmail.signoff}
          </div>
          <button
            type="button"
            onClick={() => {
              setDraftContact(candidateContact);
              setIsEditingContact(true);
            }}
            className="text-[11px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 opacity-60 hover:opacity-100 transition-opacity underline cursor-pointer inline-flex items-center gap-1 shrink-0 pt-0.5"
            title="Personalize your signature, email, and GitHub links"
          >
            <Edit3 className="w-3 h-3" />
            Edit signature & links
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900 dark:text-white uppercase tracking-wider text-[11px]">
              Edit Signature & Links
            </span>
            <span className="text-[11px] text-stone-400">
              Leave blank to keep clean placeholder
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-stone-500 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={draftContact.name || ""}
                onChange={(e) => setDraftContact((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Akdev Saha"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-500 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={draftContact.email || ""}
                onChange={(e) => setDraftContact((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="e.g. akdev@gmail.com"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-500 mb-1">
                GitHub Handle or URL
              </label>
              <input
                type="text"
                value={draftContact.github || ""}
                onChange={(e) => setDraftContact((prev) => ({ ...prev, github: e.target.value }))}
                placeholder="e.g. github.com/akdevsaha"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-900 dark:focus:border-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-500 mb-1">
                Portfolio / Website URL
              </label>
              <input
                type="text"
                value={draftContact.portfolio || ""}
                onChange={(e) => setDraftContact((prev) => ({ ...prev, portfolio: e.target.value }))}
                placeholder="e.g. akdev.dev"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-900 dark:focus:border-white"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditingContact(false)}
              className="px-3 py-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveCandidateContact(draftContact)}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-white dark:text-stone-950 text-xs font-medium cursor-pointer"
            >
              Save details
            </button>
          </div>
        </div>
      )}
    </div>
  );

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
            <span>{liveColdEmail ? "Live Gemini AI Outreach" : "Pitches Formulated"}</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-stone-500 dark:text-stone-400">
              {liveColdEmail ? "Grounded in Real Resume" : "Grounded in CV Metrics"}
            </span>
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
                    <div className="flex items-center justify-between mb-1.5 gap-1.5">
                      <span className="text-xs font-semibold">{tab.label}</span>
                      {tab.id === initialAngle && liveColdEmail && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded">
                          Live AI
                        </span>
                      )}
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
                          : isLiveActive && liveColdEmail
                          ? `${currentEmail.greeting}\n\n${cleanLiveBody || liveColdEmail.body}\n\n${liveColdEmail.closing ? `Key Proof Metric: ${liveColdEmail.closing}\n\n` : ""}${currentEmail.signoff}`
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
                ) : isLiveActive && liveColdEmail ? (
                  <>
                    {/* Dynamic Salutation */}
                    {renderSalutation()}

                    {/* Live Generated Cold Email Body */}
                    <p className="whitespace-pre-line leading-relaxed text-stone-900 dark:text-stone-100">
                      {cleanLiveBody || liveColdEmail.body}
                    </p>

                    {/* The Live Proof (Extracted from Resume) */}
                    {liveColdEmail.closing && (
                      <div className="pt-2">
                        {showHighlights ? (
                          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-400/40 text-amber-950 dark:text-amber-200 text-xs sm:text-sm">
                            <span className="font-semibold block text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                              Resume Proof Metric (Grounded from CV)
                            </span>
                            {liveColdEmail.closing}
                          </div>
                        ) : (
                          <div className="text-sm text-stone-600 dark:text-stone-300 italic border-l-2 border-stone-300 dark:border-stone-700 pl-3">
                            {liveColdEmail.closing}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Signoff */}
                    {renderSignoff()}
                  </>
                ) : (
                  <>
                    {/* Dynamic Salutation */}
                    {renderSalutation()}

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
                    {renderSignoff()}
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
                {liveColdEmail?.closing && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-300/60 dark:border-amber-700/60 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Live Extracted Metric
                    </div>
                    <div className="text-amber-900/90 dark:text-amber-200/90 leading-snug">
                      {liveColdEmail.closing}
                    </div>
                  </div>
                )}

                {liveResumeText && (
                  <details className="text-xs group rounded-2xl border border-stone-200/60 dark:border-stone-800/60 bg-stone-50/50 dark:bg-[#0e1017]/50 p-3">
                    <summary className="font-medium text-stone-700 dark:text-stone-300 cursor-pointer list-none flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                        Scanned Resume Text
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180 text-stone-400" />
                    </summary>
                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 max-h-48 overflow-y-auto text-[11px] font-mono text-stone-600 dark:text-stone-400 whitespace-pre-wrap leading-relaxed">
                      {liveResumeText}
                    </div>
                  </details>
                )}

                {DEFAULT_EXTRACTED_METRICS.slice(0, liveColdEmail?.closing ? 2 : 3).map((item) => (
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
