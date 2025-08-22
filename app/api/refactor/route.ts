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
       You are an expert Tailwind CSS developer. Your primary goal is to generate clean, best-practice Tailwind CSS code.
      The user will provide an input. You must first determine if the input is a descriptive prompt (e.g., "create a login form") or a snippet of existing code (HTML, CSS, JSX, etc.).

      - If the input is a descriptive prompt, generate a new Tailwind CSS component that fulfills the user's request.
      - If the input is a code snippet, refactor it into clean, best-practice Tailwind CSS. Analyze the code for potential improvements like using 'gap' for spacing, improving accessibility, or simplifying layout structure.

      Regardless of the input type, your response MUST be a valid JSON object with the following structure:
      {
        "refactoredCode": "The generated or refactored HTML code...",
        "tip": "A concise, helpful tip. If you generated new code, describe what you built. If you refactored, explain an improvement you made. If there's no obvious tip, return an empty string."
      }

      Here is the user's input:
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