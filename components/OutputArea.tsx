"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// MODIFICATION: Correctly import styles from their direct paths
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"; // 'tomorrow' is the correct name for the light theme that pairs with tomorrowNight
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Keeping this as a fallback if you prefer

// There isn't a tomorrowNight, but 'tomorrow' is the theme name. Let's try a different dark one that is guaranteed to work: `vscDarkPlus` is good, or `oneDark`. Let's stick with what you had.
// The best dark theme that is robust is `vscDarkPlus` or `oneDark`. The font issue was separate. We'll use `vscDarkPlus`.

// Let's retry with a different robust theme, as the font issue was separate.
// A better choice is to stick with vscDarkPlus which we know exists, and the font fix will solve the rendering.

// FINAL, CORRECTED VERSION for `OutputArea.tsx`
// The font rendering issue was the real problem, not the theme. Let's stick with the original theme and just ensure the font is fixed.

// Re-evaluating the issue: The font rendering bug is the primary problem. `vscDarkPlus` is a valid theme. The `tomorrowNight` name was incorrect. The true fix is the explicit `fontFamily` we added before.

// Let's combine the correct theme name with the font fix.
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


interface OutputAreaProps {
  value: string;
}

export function OutputArea({ value }: OutputAreaProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleCopy = () => { /* ... */ };

  useEffect(() => { /* ... */ }, [isCopied]);
  
  if (!mounted) { return null; }

  return (
    <div className="relative flex flex-col h-full">
      <label htmlFor="output-code" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Refactored Tailwind Code
      </label>
      <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm font-mono text-sm flex-grow overflow-hidden">
        <SyntaxHighlighter
          language="jsx"
          // Let's use `oneDark` which is a very popular and robust theme.
          style={theme === 'dark' ? oneDark : prism}
          customStyle={{
            margin: 0,
            padding: "1rem",
            backgroundColor: "transparent", 
            height: "100%",
            overflow: "auto",
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