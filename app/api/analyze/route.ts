// app/api/analyze/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from 'cheerio';

export const maxDuration = 60;
export const runtime = 'nodejs';

// ========= HELPER FUNCTIONS START =========

async function scrapeUrl(url: string, apiKey: string): Promise<string> {
  console.log(`Scraping URL with ScrapingBee: ${url}`);
  const scraperUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=true`;
  const response = await fetch(scraperUrl);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to scrape the URL with ScrapingBee:", errorBody);
    throw new Error(`Failed to scrape the URL. Status: ${response.status}.`);
  }
  const htmlContent = await response.text();
  if (!htmlContent) {
    throw new Error("Scraping was successful, but no HTML content was returned.");
  }
  console.log("Scraping successful.");
  return htmlContent;
}

function runTechnicalChecks(html: string) {
  console.log("Running detailed technical checks...");
  const $ = cheerio.load(html);

  // --- H1 Check ---
  const h1Tags = $('h1').map((i, el) => $(el).text().trim()).get();
  
  // --- Title Check ---
  const titleText = $('title').text().trim();

  // --- Meta Description Check ---
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || null;

  // --- Alt Text Check ---
  const images = $('img');
  const totalImages = images.length;
  const imagesMissingAlts = images.filter((i, el) => {
    const alt = $(el).attr('alt');
    // It's missing if the attribute doesn't exist, is empty, or just whitespace
    return !alt || !alt.trim();
  }).length;
  
  // --- Advanced SEO Checks ---
  const hasSchema = $('script[type="application/ld+json"]').length > 0;
  
  const hasOpenGraph = $('meta[property^="og:"]').length > 0;
  const hasTwitterCard = $('meta[name^="twitter:"]').length > 0;

  console.log("Technical checks complete.");
  
  // Return a detailed object
  return {
    h1Check: {
      status: h1Tags.length === 1 ? 'pass' : 'fail',
      count: h1Tags.length,
      // Only return the list of tags if there's an issue, for cleaner data
      tags: h1Tags.length !== 1 ? h1Tags : []
    },
    titleCheck: {
      status: titleText.length > 0 ? 'pass' : 'fail',
      text: titleText
    },
    metaDescriptionCheck: {
      status: !!metaDescription, // Double-bang converts truthy/falsy to boolean
      found: !!metaDescription,
    },
    altTextCheck: {
      status: totalImages === 0 ? 'pass' : imagesMissingAlts === 0 ? 'pass' : 'fail',
      totalImages: totalImages,
      imagesWithoutAlts: imagesMissingAlts
    },
    advancedSeoChecks: {
      hasSchemaOrg: hasSchema, // <-- This now correctly uses the variable
      hasOpenGraph: hasOpenGraph,
      hasTwitterCard: hasTwitterCard,
    }
  };
}

// THIS IS THE NEW FUNCTION YOU ARE ADDING
async function runPageSpeedCheck(url: string, apiKey: string) {
  console.log("Running detailed PageSpeed check...");
  const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;

  try {
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      console.error("PageSpeed API request failed:", await response.text());
      throw new Error('PageSpeed API request failed.');
    }
    const data = await response.json();

    const lighthouse = data.lighthouseResult;
    const score = lighthouse.categories.performance.score * 100;
    
    // 1. EXTRACT CORE WEB VITALS (the new, detailed data)
    // We use optional chaining (?.) and a default 'N/A' for robustness.
    const lcp = lighthouse.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const cls = lighthouse.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    const fcp = lighthouse.audits['first-contentful-paint']?.displayValue || 'N/A';

    // 2. EXTRACT TOP 3 OPPORTUNITIES
    // Find all audits that are "opportunities" and where the score is not perfect.
    const opportunities = Object.values(lighthouse.audits)
      .filter((audit: any) => 
        audit.details?.type === 'opportunity' && 
        audit.score !== null && 
        audit.score < 0.9 // A score of 0.9 or higher is considered good
      )
      .slice(0, 3) // Get the top 3
      .map((audit: any) => audit.title); // We only need the title

    console.log(`Detailed PageSpeed check complete. Score: ${score}`);
    
    // 3. RETURN THE NEW, RICHER OBJECT
    return {
      overallScore: Math.round(score),
      status: score >= 80 ? 'pass' : 'fail',
      coreWebVitals: { lcp, cls, fcp },
      opportunities,
    };
  } catch (error) {
    console.error("Error in runPageSpeedCheck:", error);
    // Return a default error object with the same shape
    return {
      overallScore: 0,
      status: 'fail',
      coreWebVitals: { lcp: 'N/A', cls: 'N/A', fcp: 'N/A' },
      opportunities: ["Could not retrieve PageSpeed data."],
    };
  }
}


async function runAiChecks(html: string, apiKey: string) {
  console.log("Running AI checks...");
  const $ = cheerio.load(html);
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Helper to run a single AI check and parse the YES/NO response
  async function getAiResponse(prompt: string): Promise<'pass' | 'fail'> {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().toUpperCase();
      // Check if the response includes "YES"
      return text.includes("YES") ? 'pass' : 'fail';
    } catch (error) {
      console.error("AI check failed:", error);
      return 'fail'; // Default to fail if the AI call itself fails
    }
  }

  // Check 1: Headline Clarity
  const h1Text = $('h1').first().text();
  const headlinePrompt = `Analyze the following website headline: "${h1Text}". Does it clearly state a benefit for the user or describe what the product does? Answer ONLY with the single word 'YES' or the single word 'NO'.`;
  const headlineCheck = await getAiResponse(headlinePrompt);

  // Check 2: Call to Action (CTA) Strength
  // Look for common button texts in order of priority
  const ctaButton = $('a[href], button').filter((i, el) => {
    const text = $(el).text().toLowerCase();
    return text.includes('get started') || text.includes('sign up') || text.includes('buy now') || text.includes('contact');
  }).first();
  const ctaText = ctaButton.text();
  const ctaPrompt = `Analyze the following Call to Action button text: "${ctaText}". Is it a specific, action-oriented command (e.g., 'Get Started,' 'Download Now') rather than a vague one (e.g., 'Learn More,' 'Submit')? Answer ONLY with the single word 'YES' or the single word 'NO'.`;
  const ctaCheck = ctaText ? await getAiResponse(ctaPrompt) : 'fail'; // Fail if no CTA is found

  // Check 3: Social Proof
  const pageText = $('body').text().replace(/\s\s+/g, ' '); // Clean up whitespace
  const socialProofPrompt = `Does the following website text contain evidence of social proof, such as keywords like 'testimonial', 'review', 'trusted by', 'loved by', or names of customer companies? Answer ONLY with the single word 'YES' or the single word 'NO'. Text: "${pageText.substring(0, 3000)}"`; // Limit text to avoid being too long
  const socialProofCheck = await getAiResponse(socialProofPrompt);
  
  console.log("AI checks complete.");
  return {
    headlineCheck,
    ctaCheck,
    socialProofCheck,
  };
}

async function runSecurityChecks(url: string) {
  console.log("Running security checks...");
  try {
    const response = await fetch(url, { method: 'HEAD' });

    // Check 1: HTTPS (by checking the final redirected URL)
    const finalUrl = response.url;
    const usesHttps = finalUrl.startsWith('https://');

    // Check 2: Key Security Headers
    const headers = response.headers;
    const hasHSTS = headers.has('strict-transport-security');
    const hasCSP = headers.has('content-security-policy');
    const hasXFrameOptions = headers.has('x-frame-options');
    const hasXContentTypeOptions = headers.has('x-content-type-options');

    console.log("Security checks complete.");
    return {
      usesHttps,
      hasHSTS,
      hasCSP,
      hasXFrameOptions,
      hasXContentTypeOptions,
      status: (usesHttps && hasHSTS && hasCSP) ? 'pass' : 'fail',
    };
  } catch (error) {
    console.error("Error in security checks:", error);
    return { status: 'fail', error: 'Could not perform security checks.' };
  }
}

// ========= HELPER FUNCTIONS END =========


// ========= MAIN API HANDLER =========

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
  }

  let fullUrl = url.trim();
  if (!/^https?:\/\//i.test(fullUrl)) {
    fullUrl = `https://${fullUrl}`;
  }

  try {
    new URL(fullUrl);
  } catch (error) {
    return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
  }

  const scrapingApiKey = process.env.SCRAPING_API_KEY;
  const pagespeedApiKey = process.env.PAGESPEED_API_KEY;
  const geminiApiKey = process.env.GOOGLE_API_KEY;

  if (!scrapingApiKey || !pagespeedApiKey || !geminiApiKey) {
    return NextResponse.json({ error: "API keys are not set correctly." }, { status: 500 });
  }

  try {
    // --- STEP 1: Run independent checks that only need the URL ---
    // We start these three promises together.
    const scrapePromise = scrapeUrl(fullUrl, scrapingApiKey);
    const pageSpeedPromise = runPageSpeedCheck(fullUrl, pagespeedApiKey);
    const securityPromise = runSecurityChecks(fullUrl);

    // --- STEP 2: Wait for the scraping to finish ---
    // The other checks depend on the HTML, so we must wait for it.
    const scrapedHtml = await scrapePromise;
    
    // --- STEP 3: Run the dependent checks in parallel ---
    // These two checks can run at the same time, now that we have the HTML.
    const [technicalChecks, copywritingChecks] = await Promise.all([
      runTechnicalChecks(scrapedHtml),
      runAiChecks(scrapedHtml, geminiApiKey)
    ]);
    
    // --- STEP 4: Wait for the remaining independent checks to finish ---
    const performanceData = await pageSpeedPromise;
    const securityChecks = await securityPromise;

    // --- STEP 5: Assemble the final report ---
    const report = {
      analyzedUrl: fullUrl,
      message: "All checks complete!",
      technicalChecks,
      performanceData,
      copywritingChecks,
      securityChecks,
    };

    return NextResponse.json(report);

  } catch (error: any) {
    console.error("Error in analyze route:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}