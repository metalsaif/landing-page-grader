// components/DarkModeHighlighter.tsx
"use client";
import { codeToHtml } from 'shiki';
import { useEffect, useState } from 'react';

export function DarkModeHighlighter({ code }: { code: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    async function highlight() {
      // 1. Get the original HTML from Shiki
      const highlighted = await codeToHtml(code, { 
        lang: 'html', 
        theme: 'github-dark'
      });
      
      // 2. MODIFICATION: Remove the background-color style from the HTML string
      const transparentHtml = highlighted.replace(/background-color:.*?;/, '');
      
      // 3. Set the state with the modified, transparent HTML
      setHtml(transparentHtml);
    }
    highlight();
  }, [code]);

  if (!html) return <div className="flex-grow rounded-md border border-slate-700 bg-slate-800 animate-pulse" />;
  
  return <div dangerouslySetInnerHTML={{ __html: html }} className="[&>pre]:!h-full [&>pre]:!p-4" />;
}