// components/OutputArea.tsx
"use client";

import { useState, useEffect } from "react";
import { DarkModeHighlighter } from './DarkModeHighlighter';
import { LightModeHighlighter } from './LightModeHighlighter';

interface OutputAreaProps {
  value: string;
}

export function OutputArea({ value }: OutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const codeToDisplay = value || "Your clean code will appear here...";

  const handleCopy = () => { /* ... */ };
  useEffect(() => { /* ... */ }, [isCopied]);

  return (
    <div className="relative flex flex-col h-full">
      <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Refactored Tailwind Code
      </label>

      {/* MODIFICATION: The container now handles showing/hiding */}
      <div className="flex-grow overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 text-sm">
        {/* The light mode version is hidden when in dark mode */}
        <div className="dark:hidden h-full">
          <LightModeHighlighter code={codeToDisplay} />
        </div>
        {/* The dark mode version is hidden by default, and shown only in dark mode */}
        <div className="hidden dark:block h-full">
          <DarkModeHighlighter code={codeToDisplay} />
        </div>
      </div>

      {value && (
        <button
          onClick={handleCopy}
          className="absolute top-9 right-3 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}