"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { uploadResume, AnalyzeResponse } from "@/lib/api";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  Sliders,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";

export interface UploadedFileState {
  name: string;
  size: string;
  rawFile?: File;
  isSample?: boolean;
  backendResponse?: AnalyzeResponse;
}


export type TargetRecipient = "founder" | "eng_manager" | "recruiter" | "peer";
export type TonePreset = "punchy" | "metric_heavy" | "conversational";

interface ResumeUploadSectionProps {
  onScanComplete?: (file: UploadedFileState, recipient: TargetRecipient, company: string, tone: TonePreset) => void;
  externalSampleTrigger?: number;
}

export default function ResumeUploadSection({
  onScanComplete,
  externalSampleTrigger,
}: ResumeUploadSectionProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevTriggerRef = useRef(externalSampleTrigger);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<UploadedFileState | null>(null);
  const [recipient, setRecipient] = useState<TargetRecipient>("founder");
  const [targetCompany, setTargetCompany] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [tone, setTone] = useState<TonePreset>("punchy");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Scanning progress state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState(0);
  const [isScanDone, setIsScanDone] = useState(false);

  const navigateToCraft = () => {
    if (typeof window !== "undefined" && file) {
      sessionStorage.setItem(
        "pitchcraft_data",
        JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          isSample: file.isSample,
          recipient,
          recipientName: recipientName.trim(),
          targetCompany: targetCompany || "Linear — Senior Product Engineer",
          tone,
          backendResponse: file.backendResponse,
        })
      );
    }
    const query = new URLSearchParams({
      company: targetCompany || "Linear — Senior Product Engineer",
      recipient,
      tone,
      ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
    });
    router.push(`/craft?${query.toString()}`);
  };

  // Load sample resume helper
  const loadSampleResume = () => {
    setErrorMessage(null);
    setFile({
      name: "Alex_Chen_Staff_Engineer_Resume.pdf",
      size: "248 KB",
      isSample: true,
    });
    setTargetCompany("Linear — Product Engineer");
    setIsScanDone(false);
    setScanProgress(0);
  };

  useEffect(() => {
    if (externalSampleTrigger && externalSampleTrigger > (prevTriggerRef.current ?? 0)) {
      prevTriggerRef.current = externalSampleTrigger;
      queueMicrotask(() => {
        loadSampleResume();
      });
    }
  }, [externalSampleTrigger]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    if (!selectedFile.name.toLowerCase().endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF document (.pdf format only).");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit. Please upload a smaller PDF.");
      return;
    }

    const formattedSize =
      selectedFile.size < 1024 * 1024
        ? `${Math.round(selectedFile.size / 1024)} KB`
        : `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;

    setFile({
      name: selectedFile.name,
      size: formattedSize,
      rawFile: selectedFile,
      isSample: false,
    });
    setIsScanDone(false);
    setScanProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setIsScanDone(false);
    setScanProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startScan = async () => {
    if (!file || isScanning) return;
    setIsScanning(true);
    setScanProgress(15);
    setScanStage(0);
    setIsScanDone(false);
    setErrorMessage(null);

    // Staged progression timer while upload is in progress
    const stageInterval = setInterval(() => {
      setScanStage((prev) => (prev < 2 ? prev + 1 : prev));
    }, 800);

    try {
      // Prepare file: use rawFile if available, or create mock sample PDF for sample mode
      const validSamplePdf = `%PDF-1.4\n1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj\n2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj\n3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <<>>>> endobj\n4 0 obj <</Length 62>> stream\nBT\n/F1 12 Tf\n72 712 Td\n(Alex Chen - Staff Software Engineer) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000113 00000 n \n0000000213 00000 n \ntrailer <</Size 5 /Root 1 0 R>>\nstartxref\n326\n%%EOF`;
      const fileToUpload =
        file.rawFile ||
        new File(
          [new Blob([validSamplePdf], { type: "application/pdf" })],
          file.name || "Alex_Chen_Staff_Engineer_Resume.pdf",
          { type: "application/pdf" }
        );

      const response = await uploadResume(fileToUpload, file.name, {
        recipient,
        company: targetCompany || "Linear — Senior Product Engineer",
        tone,
        recipientName: recipientName.trim() || undefined,
        onProgress: (pct) => {
          setScanProgress(Math.max(15, Math.min(90, pct)));
        },
      });

      clearInterval(stageInterval);
      setScanStage(2);
      setScanProgress(100);

      const updatedFileState: UploadedFileState = {
        ...file,
        backendResponse: response,
      };

      setFile(updatedFileState);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "pitchcraft_data",
          JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            isSample: file.isSample,
            recipient,
            recipientName: recipientName.trim(),
            targetCompany: targetCompany || "Linear — Senior Product Engineer",
            tone,
            backendResponse: response,
          })
        );
      }

      setTimeout(() => {
        setIsScanning(false);
        setIsScanDone(true);
        if (onScanComplete) {
          onScanComplete(updatedFileState, recipient, targetCompany, tone);
        }
      }, 400);
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setIsScanning(false);
      setScanProgress(0);

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.error) {
          setErrorMessage(`Backend error: ${err.response.data.error}`);
        } else if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
          setErrorMessage(
            "Could not connect to backend at http://localhost:5001/analyse. Please verify your backend server is running."
          );
        } else {
          setErrorMessage(err.message || "Failed to upload file to backend.");
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred while uploading the file.");
      }
    }
  };

  const scanStages = [
    "Uploading resume to backend (localhost:3000/analyse)...",
    "Extracting PDF text layers, job chronology, and key achievements...",
    "Calibrating pitch angles and tailored cold emails...",
  ];


  return (
    <section id="upload-section" className="w-full max-w-5xl mx-auto scroll-mt-24">
      {/* Standalone Elegant Card */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 sm:p-10 lg:p-12 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-stone-100 dark:border-stone-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
              Upload Your Resume
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              Extract verified metrics, accomplishments, and tech stack in seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSampleResume}
            className="self-start sm:self-center inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/70 hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Load Sample Resume</span>
          </button>
        </div>

        {/* Error notification if wrong file type */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* DROPZONE / FILE SELECTOR */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {!file ? (
            /* Empty / Idle Dropzone State */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all cursor-pointer select-none bg-stone-50/50 dark:bg-[#0e1017]/50 ${
                isDragging
                  ? "border-stone-900 bg-stone-100/80 dark:border-white/50 dark:bg-white/[0.05]"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/30"
              }`}
            >
              <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 ${
                    isDragging
                      ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md"
                      : "bg-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-xs"
                  }`}
                >
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-base font-semibold text-stone-900 dark:text-white">
                    <span className="underline underline-offset-4 decoration-stone-300 dark:decoration-stone-600">
                      Click to upload resume
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Standard PDF documents up to 10MB
                  </p>
                </div>

                {/* Trust Row */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Zero Data Retention
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Extracts Metrics & Stack
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-500" />
                    No Generic AI Fluff
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* File Uploaded Preview Card */
            <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#0e1017] p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center text-stone-900 dark:text-stone-100 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate max-w-[240px] sm:max-w-md">
                        {file.name}
                      </p>
                      {file.isSample ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 rounded-md">
                          Sample
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 rounded-md">
                          PDF Ready
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for extraction
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    Change PDF
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scanning Active Progress Feedback */}
              {isScanning && (
                <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin text-stone-500" />
                      <span>{scanStages[scanStage]}</span>
                    </div>
                    <span className="text-stone-500 font-mono">{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-900 dark:bg-white rounded-full transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Scanning Completed Banner */}
              {isScanDone && (
                <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-stone-800 dark:text-stone-200 text-xs flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-medium text-emerald-900 dark:text-emerald-200">
                        Resume analyzed. Extracted 4 quantified achievements and 9 core competencies.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={navigateToCraft}
                      className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 underline underline-offset-4 flex items-center gap-1 hover:text-emerald-950 dark:hover:text-white cursor-pointer"
                    >
                      Open Crafted Emails <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CUSTOMIZATION CONTROLS */}
        <div className="mt-10 pt-8 border-t border-stone-100 dark:border-stone-800/60 space-y-6">
          {/* Row 1: Target Recipient Selector */}
          <div>
            <div className="mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-stone-500" />
                Target Recipient
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: "founder",
                  title: "Founder / CEO",
                  badge: "< 85 words",
                  desc: "Punchy, ROI & speed",
                },
                {
                  id: "eng_manager",
                  title: "Engineering Lead",
                  badge: "Tech deep-dive",
                  desc: "Architecture & metrics",
                },
                {
                  id: "recruiter",
                  title: "Talent / Recruiter",
                  badge: "ATS aligned",
                  desc: "Role fit & track record",
                },
                {
                  id: "peer",
                  title: "Peer / Senior IC",
                  badge: "Casual chat",
                  desc: "Mutual craft & curiosity",
                },
              ].map((item) => {
                const isSelected = recipient === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRecipient(item.id as TargetRecipient)}
                    className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? "bg-stone-900 text-stone-50 border-stone-900 dark:bg-white dark:text-stone-950 dark:border-white shadow-xs"
                        : "bg-white hover:bg-stone-50 dark:bg-[#0e1017] dark:hover:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isSelected
                            ? "bg-white/20 text-white dark:bg-black/15 dark:text-stone-900"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <span
                      className={`text-xs ${
                        isSelected
                          ? "text-stone-300 dark:text-stone-600"
                          : "text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Target Company & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Target Company / Role */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-stone-500" />
                  Target Company & Role
                </label>
                <span className="text-xs text-stone-400">e.g. Stripe, Linear</span>
              </div>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Linear — Senior Product Engineer"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0e1017] border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-900 dark:focus:border-white transition-all"
              />
            </div>

            {/* Tone Calibration */}
            <div>
              <div className="mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-stone-500" />
                  Tone Preset
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "punchy", label: "Direct & Crisp" },
                  { id: "metric_heavy", label: "Metric-Heavy" },
                  { id: "conversational", label: "Warm & Direct" },
                ].map((t) => {
                  const isSelected = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id as TonePreset)}
                      className={`py-2.5 px-3 rounded-xl text-center text-xs font-medium transition-all cursor-pointer border ${
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

            {/* Row 3: Recipient Name (Optional) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-stone-500" />
                  Recipient Name <span className="text-[11px] font-normal text-stone-400 lowercase">(optional)</span>
                </label>
                <span className="text-xs text-stone-400">
                  {recipientName.trim()
                    ? `Salutation: "Hi ${recipientName.trim()},"`
                    : `Defaults to "Hi ${(targetCompany.split("—")[0]?.trim() || "Linear")} Team,"`}
                </span>
              </div>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Karri Saarinen, Sam Altman, or leave blank to address team"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0e1017] border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-900 dark:focus:border-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTON */}
        <div className="mt-10 pt-6 border-t border-stone-100 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to backend API • localhost:5001/analyse</span>
          </div>

          <button
            type="button"
            disabled={!file || isScanning}
            onClick={isScanDone ? navigateToCraft : startScan}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs ${
              !file
                ? "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 border border-stone-200 dark:border-stone-700 cursor-not-allowed"
                : isScanning
                ? "bg-stone-800 text-stone-50 dark:bg-white/80 dark:text-stone-950 cursor-wait opacity-90"
                : "bg-stone-900 hover:bg-black text-stone-50 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 active:scale-98"
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-inherit" />
                <span>Uploading & Analyzing Resume...</span>
              </>
            ) : isScanDone ? (
              <>
                <Sparkles className="w-4 h-4 text-inherit" />
                <span>Open Crafted Emails</span>
                <ArrowRight className="w-4 h-4 text-inherit" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-inherit" />
                <span>Upload & Generate Cold Emails</span>
                <ArrowRight className="w-4 h-4 text-inherit" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
