// lib/types.ts

export interface ReportData {
  analyzedUrl: string;
  message: string;
  technicalChecks: {
    h1Check: { status: 'pass' | 'fail'; count: number; tags: string[] };
    titleCheck: { status: 'pass' | 'fail'; text: string };
    metaDescriptionCheck: { status: boolean; found: boolean };
    altTextCheck: { status: 'pass' | 'fail'; totalImages: number; imagesWithoutAlts: number };
    advancedSeoChecks: { hasSchemaOrg: boolean; hasOpenGraph: boolean; hasTwitterCard: boolean };
  };
  performanceData: {
    overallScore: number;
    status: 'pass' | 'fail';
    coreWebVitals: { lcp: string; cls: string; fcp: string };
    opportunities: string[];
  };
  copywritingChecks: {
    headlineCheck: 'pass' | 'fail';
    ctaCheck: 'pass' | 'fail';
    socialProofCheck: 'pass' | 'fail';
    // This is the structure from our AI check, which might include an error
    error?: string; 
  };
  // THIS IS THE FIX: Add the new securityChecks object
  securityChecks: {
    status: 'pass' | 'fail';
    usesHttps: boolean;
    hasHSTS: boolean;
    hasCSP: boolean;
    hasXFrameOptions: boolean;
    hasXContentTypeOptions: boolean;
    error?: string;
  };
}