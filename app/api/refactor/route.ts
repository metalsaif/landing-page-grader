// app/api/refactor/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60; 
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY is not set." }, { status: 500 });
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }

    const prompt = `
      You are an expert Tailwind CSS developer. Your task is to refactor a snippet of HTML/CSS into clean, best-practice Tailwind CSS.
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

    // The API's job is now DONE. It just sends the raw response back.
    // The JSON parsing and formatting will happen on the client.
    return NextResponse.json({ aiResponseText });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred on the server. Please check the logs." },
      { status: 500 }
    );
  }
}