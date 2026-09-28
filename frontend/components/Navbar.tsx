"use client";

import React from "react";
import { Sparkles, ArrowRight, FileText, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavbarProps {
  onLoadSample: () => void;
  onScrollToUpload: () => void;
}

export default function Navbar({ onLoadSample, onScrollToUpload }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbfbf9]/80 dark:bg-[#0c0d12]/80 backdrop-blur-lg border-b border-stone-200/60 dark:border-stone-800/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-950 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white">PitchCraft</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded">
              AI
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500 dark:text-stone-400">
          <a href="#upload-section" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Scanner
          </a>
          <a href="#live-preview" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Emails
          </a>
          <a href="#comparison" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Comparison
          </a>
          <a href="#how-it-works" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            Pipeline
          </a>
          <a href="#faq" className="hover:text-stone-900 dark:hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
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
            onClick={onLoadSample}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>Sample CV</span>
          </button>

          <button
            onClick={onScrollToUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-50 bg-stone-900 hover:bg-black dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>Scan Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
