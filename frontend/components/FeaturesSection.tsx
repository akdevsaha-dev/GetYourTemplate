"use client";

import React from "react";
import {
  BarChart3,
  FilterX,
  Target,
  Layers,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Hard-Metric Extraction",
      description:
        "PitchCraft isolates your exact numbers — throughput improvements, revenue generated, team sizes, and latency reductions — turning raw CV bullets into high-leverage business hooks.",
      highlight: "No generic 'passionate team player'",
    },
    {
      icon: Target,
      title: "Role-Calibrated Tone",
      description:
        "Founders get concise 80-word value statements. Engineering directors get architecture details and tech stack synergy. Recruiters get exact ATS alignment.",
      highlight: "Targeted to reader psychology",
    },
    {
      icon: FilterX,
      title: "Zero AI Detection Tell-Tales",
      description:
        "Bans all robotic vocabulary: 'delve', 'testament to', 'beacon of innovation', or fake conversational filler. Formatted like a real, hand-crafted email sent from Apple Mail or Superhuman.",
      highlight: "100% human-sounding syntax",
    },
    {
      icon: Layers,
      title: "Multi-Touch Follow-Up Cadence",
      description:
        "Most responses come from the second or third touch. PitchCraft automatically drafts non-annoying follow-ups with genuine value adds like demos, benchmark analyses, or code repos.",
      highlight: "3-step sequence included",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
          Engineered for Maximum Replies
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          Decision makers decide within seconds. Here is how PitchCraft ensures your emails get answered.
        </p>
      </div>

      {/* 2x2 Separated Grid with Empty Space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/70 text-stone-900 dark:text-white flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/60 flex items-center justify-between text-xs">
                <span className="text-stone-700 dark:text-stone-300 font-medium">{item.highlight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
