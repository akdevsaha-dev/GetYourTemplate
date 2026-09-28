"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does PitchCraft turn my resume into cold emails?",
      a: "PitchCraft parses the raw text and structure of your PDF to isolate verified quantifiable proof: performance metrics, system scale, technical stack, and milestone achievements. It then feeds these concrete facts into cold email templates that avoid generic fluff and speak directly to hiring managers.",
    },
    {
      q: "Is my resume data stored permanently or used to train models?",
      a: "No. Resumes are processed in ephemeral memory for the duration of your session and are never retained, sold, or used for model training. Your career history and contact details remain strictly private.",
    },
    {
      q: "Why are the generated cold emails under 90 words?",
      a: "Data from over 250,000 cold outreach emails across tech companies shows that messages between 50 and 90 words have the highest response rate. Busy founders and engineering leads read email on phones between meetings; long letters with five paragraphs get archived immediately.",
    },
    {
      q: "Can I target specific companies or roles?",
      a: "Yes! In the scanner controls, you can specify your target company (e.g. 'Linear', 'Stripe', 'Ramp') and the recipient's role (Founder, Engineering Manager, Recruiter, or Peer). PitchCraft will tailor the technical depth and hook accordingly.",
    },
    {
      q: "Will these emails trigger spam filters?",
      a: "No. PitchCraft generates plain-text style emails with natural human sentence structure. It intentionally eliminates spam trigger keywords, aggressive sales language, and excessive formatting that spam filters flag.",
    },
    {
      q: "Does it support non-engineering resumes?",
      a: "Yes. While tuned heavily for software engineers, product managers, and designers, PitchCraft extracts quantifiable impact from sales, marketing, and operations resumes just as effectively.",
    },
  ];

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          Clear answers on privacy, parsing, and cold outreach.
        </p>
      </div>

      {/* Separated Accordion Cards with Empty Space */}
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-[#12141c]/70 backdrop-blur-sm overflow-hidden shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-semibold text-stone-900 dark:text-white hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-stone-900 dark:text-white" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm text-stone-500 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
