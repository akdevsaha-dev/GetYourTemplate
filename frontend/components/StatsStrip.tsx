"use client";

import React from "react";
import { TrendingUp, Clock, ShieldCheck, Zap } from "lucide-react";

export default function StatsStrip() {
  const stats = [
    {
      icon: TrendingUp,
      value: "4.8x",
      label: "Higher Reply Rate",
      detail: "Compared to generic LinkedIn templates",
    },
    {
      icon: Clock,
      value: "< 85 words",
      label: "Optimized Brevity",
      detail: "Formulated for quick mobile triage",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Private & Ephemeral",
      detail: "Resumes parsed in memory, never saved",
    },
    {
      icon: Zap,
      value: "15s",
      label: "From CV to Outreach",
      detail: "3 distinct angles generated instantly",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm p-6 sm:p-7 flex flex-col items-center text-center justify-center gap-2 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/70 flex items-center justify-center text-stone-700 dark:text-stone-300 mb-1">
                <Icon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              </div>
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white font-sans">
                {stat.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                {stat.label}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 max-w-[180px] leading-relaxed">
                {stat.detail}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
