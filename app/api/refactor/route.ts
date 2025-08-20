// app/api/refactor/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prettier from "prettier";
import * as prettierPluginTailwind from "prettier-plugin-tailwindcss";

// MODIFICATION 1: Add maxDuration to prevent Vercel serverless timeouts.
export const maxDuration = 60; 
export const runtime = 'nodejs';

export async function POST(request: Request) {
  // MODIFICATION 2: Add a check for the API key before using it.
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY is not set in environment variables." }, { status: 500 });
  }
  
  // Use the verified apiKey to initialize the client.
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }

    const prompt = `
      You are an expert Tailwind CSS developer. Your task is to refactor a snippet of HTML/CSS into clean, best-practice Tailwind CSS.
      Analyze the code for potential improvements beyond simple class conversion, such as using 'gap' for spacing, improving accessibility, or simplifying layout structure.
      Your response MUST be a valid JSON object with the following structure:
      {
        "refactoredCode": "The refactored HTML code...",
        "tip": "A concise, helpful tip for improvement. If there's no obvious tip, return an empty string."
      }
      Here is the code to refactor:
      \`\`\`html
      ${code}
      \`\`\`
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponseText = response.text();

    let refactoredCode = "";
    let tip = "";

    try {
      const cleanedJsonString = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedJson = JSON.parse(cleanedJsonString);
      refactoredCode = parsedJson.refactoredCode || "";
      tip = parsedJson.tip || "";
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      refactoredCode = aiResponseText;
      tip = "The AI response was not in the expected format.";
    }

    const formattedCode = await prettier.format(refactoredCode, {
      parser: "html",
      plugins: [prettierPluginTailwind],
    });

    return NextResponse.json({ refactoredCode: formattedCode, tip });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred on the server. Please check the logs." },
      { status: 500 }
    );
  }
}