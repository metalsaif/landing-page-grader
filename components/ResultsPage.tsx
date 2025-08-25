// components/ResultsPage.tsx

import { ReportData } from "@/lib/types"; // Import the type we just created

// You can create these as separate components or keep them here for simplicity
const CheckIcon = () => <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const ChecklistItem = ({ status, text, children }: { status: 'pass' | 'fail', text: string, children?: React.ReactNode }) => {
  return (
    <div className="flex items-start p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="flex-shrink-0">
        {status === 'pass' ? <CheckIcon /> : <XIcon />}
      </div>
      <div className="ml-4">
        <p className="font-semibold text-slate-700 dark:text-slate-300">{text}</p>
        {children && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{children}</p>}
      </div>
    </div>
  );
};

interface ResultsPageProps {
  data: ReportData;
  onReset: () => void; // A function to go back to the main page
}

export const ResultsPage = ({ data, onReset }: ResultsPageProps) => {
  // We will build out the scoring logic and checklist sections here
  const overallScore = data.performanceData.overallScore; // For now, we'll use the performance score

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-auto my-8 animate-fade-in">
      
      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Your Landing Page Report</h2>
        <p className="text-slate-500 mt-2">
          Results for: <a href={data.analyzedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.analyzedUrl}</a>
        </p>
        <p className="text-slate-500 mt-2">Here's how your page performed against our checks.</p>
      </div>

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full border-8 ${overallScore >= 80 ? 'border-green-400 dark:border-green-500' : (overallScore >= 50 ? 'border-yellow-400 dark:border-yellow-500' : 'border-red-400 dark:border-red-500')}`}>
          <span className="text-5xl font-bold text-slate-700 dark:text-slate-300">{overallScore}</span>
          <span className="text-xl mt-1 text-slate-500">/100</span>
        </div>
        <p className="font-semibold text-lg mt-4 text-slate-600 dark:text-slate-400">Overall Performance Score</p>
      </div>

      {/* Checklist Sections */}
<div className="space-y-8">

  {/* SECTION 1: TECHNICAL & SEO */}
  <div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Technical & SEO</h3>
    <div className="space-y-3">
      <ChecklistItem status={data.technicalChecks.h1Check.status} text="Has a Single H1 Tag">
        {data.technicalChecks.h1Check.status === 'fail' && `Found ${data.technicalChecks.h1Check.count} H1 tags. For best SEO, a page should have exactly one.`}
      </ChecklistItem>
      <ChecklistItem status={data.technicalChecks.titleCheck.status} text="Has a Title Tag">
        {data.technicalChecks.titleCheck.status === 'fail' && 'A descriptive title tag is crucial for search engine visibility.'}
      </ChecklistItem>
      <ChecklistItem status={data.technicalChecks.metaDescriptionCheck.status ? 'pass' : 'fail'} text="Has a Meta Description">
        {!data.technicalChecks.metaDescriptionCheck.status && 'The meta description is the summary shown in search results. It\'s critical for click-through rates.'}
      </ChecklistItem>
      <ChecklistItem status={data.technicalChecks.altTextCheck.status} text="All Images Have Alt Text">
        {data.technicalChecks.altTextCheck.status === 'fail' && `${data.technicalChecks.altTextCheck.imagesWithoutAlts} of ${data.technicalChecks.altTextCheck.totalImages} images are missing alt text. This hurts accessibility and SEO.`}
      </ChecklistItem>
    </div>
  </div>

  {/* SECTION 2: PERFORMANCE */}
  <div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Performance</h3>
    <div className="space-y-3">
      <ChecklistItem 
        status={data.performanceData.status} 
        text="Mobile Performance Grade"
      >
        Core Web Vitals: 
        <span className="font-semibold"> LCP:</span> {data.performanceData.coreWebVitals.lcp}, 
        <span className="font-semibold"> CLS:</span> {data.performanceData.coreWebVitals.cls}, 
        <span className="font-semibold"> FCP:</span> {data.performanceData.coreWebVitals.fcp}
      </ChecklistItem>
      {data.performanceData.opportunities && data.performanceData.opportunities.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Top Opportunities for Improvement:</p>
          <ul className="list-disc list-inside text-sm text-slate-500 dark:text-slate-400 space-y-1">
            {data.performanceData.opportunities.map((opp, index) => <li key={index}>{opp}</li>)}
          </ul>
        </div>
      )}
    </div>
  </div>

  {/* SECTION 3: COPYWRITING & MARKETING */}
  <div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Copywriting & Marketing</h3>
    <div className="space-y-3">
      <ChecklistItem status={data.copywritingChecks.headlineCheck} text="Headline Clarity">
        A clear headline that states a benefit is the most important piece of copy on your page.
      </ChecklistItem>
      <ChecklistItem status={data.copywritingChecks.ctaCheck} text="Strong Call to Action (CTA)">
        An action-oriented CTA tells users exactly what to do next, increasing conversion rates.
      </ChecklistItem>
      <ChecklistItem status={data.copywritingChecks.socialProofCheck} text="Presence of Social Proof">
        Testimonials, reviews, or logos of customers build trust and credibility with new visitors.
      </ChecklistItem>
    </div>
  </div>
</div>

  {/* SECTION 4: SECURITY & TRUST */}
<div>
  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Security & Trust</h3>
  <div className="space-y-3">
    <ChecklistItem status={data.securityChecks.status} text="Uses Modern Security Practices">
      {data.securityChecks.status === 'fail' && 'Implementing security headers like HSTS and CSP protects your users from common attacks.'}
    </ChecklistItem>
    {/* Optional: Show a detailed breakdown of which headers are missing */}
    {data.securityChecks.status === 'fail' && (
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Missing Recommendations:</p>
        <ul className="list-disc list-inside text-sm text-slate-500 dark:text-slate-400 space-y-1">
          {!data.securityChecks.usesHttps && <li>Site is not served over HTTPS</li>}
          {!data.securityChecks.hasHSTS && <li>Strict-Transport-Security (HSTS) header</li>}
          {!data.securityChecks.hasCSP && <li>Content-Security-Policy (CSP) header</li>}
          {!data.securityChecks.hasXFrameOptions && <li>X-Frame-Options header</li>}
          {!data.securityChecks.hasXContentTypeOptions && <li>X-Content-Type-Options header</li>}
        </ul>
      </div>
    )}
  </div>
</div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Ready to Get Your Score to 100?</h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          My name is Saif Rahman, and I'm a front-end specialist who helps founders build high-performance websites that turn visitors into customers. If you'd like professional help fixing these issues, let's have a conversation.
        </p>
        <button 
          onClick={() => window.location.href = 'https://linktr.ee/metalsaif'}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Let's Talk
        </button>
      </div>
      
      <div className="text-center mt-8">
        <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          &larr; Analyze another page
        </button>
      </div>
    </div>
  );
};