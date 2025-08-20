"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
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
    <div className="relative flex flex-col h-full">
      <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Refactored Tailwind Code
      </label>
      <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm font-mono text-sm flex-grow overflow-hidden">
        <SyntaxHighlighter
          language="jsx"
          style={theme === 'dark' ? vscDarkPlus : prism}
          customStyle={{
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent", 
            height: "100%",
            overflow: "auto",
            // The font is now fixed
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
          }}
          codeTagProps={{ style: { fontFamily: "inherit" } }}
          wrapLongLines={true}
        >
          {value || "Your clean code will appear here..."}
        </SyntaxHighlighter>
      </div>
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