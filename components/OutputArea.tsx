// components/OutputArea.tsx

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
// MODIFICATION: Import the correct, client-safe function from shiki
import { codeToHtml } from 'shiki';

interface OutputAreaProps {
  value: string;
}

export function OutputArea({ value }: OutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");

  useEffect(() => setMounted(true), []);
  
  // This effect will now use the correct function to highlight the code
  useEffect(() => {
    async function highlight() {
      if (mounted) {
        // Use the all-in-one 'codeToHtml' function. It's designed for this!
        const html = await codeToHtml(value || "Your clean code will appear here...", {
          lang: 'html',
          // We can use any of Shiki's built-in themes
          theme: theme === 'dark' ? 'github-dark' : 'github-light',
        });
        setHighlightedHtml(html);
      }
    }

    highlight();
  }, [value, theme, mounted]); // Re-run when the code or theme changes


  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // To prevent a flicker on load, we show a placeholder while Shiki is loading.
  if (!mounted || !highlightedHtml) {
    return (
      <div className="relative flex flex-col h-full">
         <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Refactored Tailwind Code
         </label>
         <div className="flex-grow rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Refactored Tailwind Code
      </label>
      <div 
        className="flex-grow overflow-auto rounded-md border border-slate-300 dark:border-slate-700 text-sm [&>pre]:!h-full [&>pre]:!p-4 [&>pre]:!bg-transparent"
        // This renders the HTML that Shiki generates
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      {value && (
        <button
          onClick={handleCopy}
          className="absolute top-9 right-3 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-slate-300 bg-blue-100 dark:bg-slate-700 rounded-md hover:bg-blue-200 dark:hover:bg-slate-600 transition-colors z-10"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}