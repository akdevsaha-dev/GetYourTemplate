"use client";

import React from "react";
import { UploadCloud, Cpu, Send } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      icon: UploadCloud,
      title: "Upload Your Resume PDF",
      description:
        "Drop your CV in standard PDF format. PitchCraft parses your metrics, tech stack, and achievements in memory.",
    },
    {
      step: "2",
      icon: Cpu,
      title: "Select Target & Tone",
      description:
        "Calibrate for your reader — founder, engineering lead, or recruiter — with the right balance of brevity and depth.",
    },
    {
      step: "3",
      icon: Send,
      title: "Copy High-Reply Pitches",
      description:
        "Get tailored subject lines, metric-backed proof points, and low-friction follow-ups ready to send.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
          How It Works
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          From raw PDF to high-converting cold email in 15 seconds.
        </p>
      </div>

      {/* 3-Column Separated Cards with Empty Space */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/70 text-stone-900 dark:text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center text-xs font-semibold">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-stone-900 dark:text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
