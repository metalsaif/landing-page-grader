// components/OutputArea.tsx

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
  
  useEffect(() => {
    async function highlight() {
      if (mounted) {
        const html = await codeToHtml(value || "Your clean code will appear here...", {
          lang: 'html',
          theme: theme === 'dark' ? 'github-dark' : 'github-light',
        });
        setHighlightedHtml(html);
      }
    }
    highlight();
  }, [value, theme, mounted]);

  const handleCopy = () => { /* ... */ };
  useEffect(() => { /* ... */ }, [isCopied]);

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
      
      {/* 
        MODIFICATION: The key is to render the HTML from Shiki directly.
        Shiki's output includes a <pre> tag with its OWN background color.
        We just need to make sure this div doesn't add a conflicting background.
        The overflow-hidden and rounded-md will now correctly apply to Shiki's output.
      */}
      <div 
        className="flex-grow overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 text-sm [&>pre]:!h-full [&>pre]:!p-4"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      
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