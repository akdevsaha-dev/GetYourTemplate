"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/60 dark:border-stone-800/60 mt-16 text-sm text-stone-500 dark:text-stone-400 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p>© {new Date().getFullYear()} PitchCraft AI. Built for candidates who value craft over spam.</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
