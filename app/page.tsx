// app/page.tsx

"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { InputArea } from "@/components/InputArea";
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ResultsPage } from "@/components/ResultsPage";
import { ReportData } from "@/lib/types";

const LoadingState = ({ message }: { message: string }) => (
  <div className="text-center p-8">
    <div className="mx-auto w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-700 rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-500 dark:text-slate-400">{message}</p>
  </div>
);

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleAnalyze = async () => {
  if (!url) return;
  setIsLoading(true);
  setReportData(null);
  setLoadingMessage("Running analysis... This can take up to 60 seconds.");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to analyze the page. Server responded with: ${errorText}`);
    }
    
    const data: ReportData = await response.json();
    setReportData(data);

  } catch (error: any) {
    console.error("Analysis failed:", error);
    
    // THIS IS THE FINAL, CORRECT ERROR OBJECT
    const errorReport: ReportData = {
      analyzedUrl: url,
      message: "Analysis Failed",
      technicalChecks: {
        h1Check: { status: 'fail', count: 0, tags: [] },
        titleCheck: { status: 'fail', text: "Error" },
        metaDescriptionCheck: { status: false, found: false },
        altTextCheck: { status: 'fail', totalImages: 0, imagesWithoutAlts: 0 },
        advancedSeoChecks: { hasSchemaOrg: false, hasOpenGraph: false, hasTwitterCard: false },
      },
      performanceData: {
        overallScore: 0,
        status: 'fail',
        coreWebVitals: { lcp: 'N/A', cls: 'N/A', fcp: 'N/A' },
        opportunities: [error.message || "An unknown error occurred."],
      },
      copywritingChecks: {
        headlineCheck: 'fail',
        ctaCheck: 'fail',
        socialProofCheck: 'fail',
      },
      // This is the new section that fixes the error
      securityChecks: {
        status: 'fail',
        usesHttps: false,
        hasHSTS: false,
        hasCSP: false,
        hasXFrameOptions: false,
        hasXContentTypeOptions: false,
        error: "Could not perform security checks due to a prior error.",
      },
    };
    setReportData(errorReport);
  } finally {
    setIsLoading(false);
  }
};


  const handleReset = () => {
    setUrl("");
    setReportData(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-200 transition-colors">
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeSwitcher />
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        
        {reportData ? (
          <ResultsPage data={reportData} onReset={handleReset} />
        ) : isLoading ? (
          <LoadingState message={loadingMessage} />
        ) : (
          <div className="w-full max-w-2xl text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200">
              Is Your Landing Page Built to Convert?
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Get a free, instant audit of your page's technical, performance, and marketing readiness.
            </p>
            <div className="mt-8 flex gap-2">
              <InputArea value={url} onChange={setUrl} placeholder="Enter your website URL (e.g., https://...)" />
              <button
                onClick={handleAnalyze}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-sm disabled:bg-blue-300"
                disabled={isLoading || !url}
              >
                Analyze
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}