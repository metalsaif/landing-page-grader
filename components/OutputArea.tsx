"use client";

import { useState, useEffect } from "react";
// MODIFICATION: Import the useTheme hook to detect the current theme
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// MODIFICATION: Import a style for LIGHT mode (prism) and keep the one for DARK mode (vscDarkPlus)
import { vscDarkPlus, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
interface OutputAreaProps {
  value: string;
}

export function OutputArea({ value }: OutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

   if (!mounted) {
    return null;
  }

  return (
    // MODIFIED: Make the container a full-height flex column
    <div className="relative flex flex-col h-full">
      <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Refactored Tailwind Code
      </label>
      {/* MODIFIED: Added flex-grow to make this wrapper fill the space */}
      <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm font-mono text-sm flex-grow overflow-hidden">
        <SyntaxHighlighter
          language="jsx"
           style={theme === 'dark' ? vscDarkPlus : prism}
          customStyle={{
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent", 
            // MODIFIED: Changed fixed height to 100% to fill its parent
            height: "100%",
            overflow: "auto"
          }}
          codeTagProps={{ style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" } }}
          wrapLongLines={true}
        >
          {value || "Your clean code will appear here..."}
        </SyntaxHighlighter>
      </div>
      {value && (
        <button
          onClick={handleCopy}
          // MODIFIED: Updated button colors for a better light theme
          className="absolute top-9 right-3 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-slate-300 bg-blue-100 dark:bg-slate-700 rounded-md hover:bg-blue-200 dark:hover:bg-slate-600 transition-colors z-10"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}