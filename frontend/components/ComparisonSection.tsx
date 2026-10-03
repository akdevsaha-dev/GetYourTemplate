"use client";

import React from "react";
import { XCircle, CheckCircle2, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section id="comparison" className="w-full max-w-5xl mx-auto scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
          Why 98% of Cold Emails Get Deleted
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          Founders get dozens of generic messages every week. PitchCraft extracts your actual career metrics so you stand out immediately.
        </p>
      </div>

      {/* Connected 2-Column Box Grid -> Now Separated Cards with Empty Space */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Left: The Generic Cold Email */}
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/60 dark:bg-[#12141c]/60 backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-stone-100 dark:border-stone-800/60 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Generic Template</h3>
                  <span className="text-xs text-stone-500">Copy-pasted mass outreach</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                <span>&lt; 2% Reply</span>
              </div>
            </div>

            {/* Email Mockup */}
            <div className="rounded-2xl bg-stone-50/70 dark:bg-[#0e1017]/70 border border-stone-200/70 dark:border-stone-800/70 p-4 text-xs text-stone-500 dark:text-stone-400 space-y-2.5 leading-relaxed mb-6">
              <div className="text-stone-400 text-[11px] font-mono">Subject: Application for Software Engineer Role at Company</div>
              <p className="line-through decoration-stone-300 dark:decoration-stone-700 opacity-80">
                &ldquo;Dear Hiring Manager, I am a passionate, hard-working fullstack developer with a deep enthusiasm for technology...&rdquo;
              </p>
              <p className="line-through decoration-stone-300 dark:decoration-stone-700 opacity-80">
                &ldquo;Attached is my resume. Please let me know if we can schedule a 30-minute call to discuss my skill set!&rdquo;
              </p>
            </div>

            {/* Why it fails */}
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-stone-800 dark:text-stone-200">Generic opener:</strong> Triggers the mental spam filter instantly.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-stone-800 dark:text-stone-200">Zero proof:</strong> No metrics, systems built, or problems solved.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong className="text-stone-800 dark:text-stone-200">High friction ask:</strong> Demands 30 minutes with no upfront value.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/60 text-xs text-stone-400 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-stone-400" /> Archived in under 3 seconds
          </div>
        </div>

        {/* Right: The PitchCraft Tailored Way */}
        <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#12141c]/80 backdrop-blur-sm p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-stone-100 dark:border-stone-800/60 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-950 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white">PitchCraft Angle</h3>
                  <span className="text-xs text-stone-500">Parsed from your actual resume</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>38% - 46% Reply</span>
              </div>
            </div>

            {/* Email Mockup */}
            <div className="rounded-2xl bg-stone-50/70 dark:bg-[#0e1017]/70 border border-stone-200/70 dark:border-stone-800/70 p-4 text-xs text-stone-800 dark:text-stone-200 space-y-2.5 leading-relaxed mb-6">
              <div className="text-stone-400 text-[11px] font-mono">Subject: Quick observation on Linear&apos;s real-time sync & latency</div>
              <p>
                &ldquo;Hi Linear Team, saw your recent note on offline sync. At my previous startup,
                I re-architected our Postgres pipeline, dropping write latency by <span className="text-amber-900 bg-amber-500/15 dark:text-amber-200 px-1 py-0.5 rounded-md font-medium">43% across 12M events</span>.&rdquo;
              </p>
              <p>
                &ldquo;Mapped out 2 approaches to reduce edge cold-starts. Open to a 5-minute async Loom or brief sync?&rdquo;
              </p>
            </div>

            {/* Why it works */}
            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-900 dark:text-white">Contextual hook:</strong> Speaks directly to what the team is currently solving.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-900 dark:text-white">Grounded metrics:</strong> Real numbers prove capability before the call.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-stone-900 dark:text-white">Low-friction ask:</strong> 5-minute async option makes replying effortless.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Fast replies from decision makers
          </div>
        </div>
      </div>
    </section>
  );
}
