import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import prettier from "prettier";
import * as prettierPluginTailwind from "prettier-plugin-tailwindcss";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    if (!code) { /* ... error handling ... */ }

    // MODIFICATION: The prompt now asks for a JSON object with a 'tip' field.
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

    // MODIFICATION: Robustly parse the AI's JSON response
    try {
      // First, clean any markdown formatting around the JSON
      const cleanedJsonString = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedJson = JSON.parse(cleanedJsonString);
      refactoredCode = parsedJson.refactoredCode || "";
      tip = parsedJson.tip || "";
    } catch (e) {
      // Fallback if AI fails to return valid JSON
      console.error("Failed to parse AI JSON response:", e);
      refactoredCode = aiResponseText; // Assume the whole response is the code
      tip = "The AI response was not in the expected format.";
    }

    const formattedCode = await prettier.format(refactoredCode, {
      parser: "html",
      plugins: [prettierPluginTailwind],
    });

    // MODIFICATION: Return the code AND the tip to the client
    return NextResponse.json({ refactoredCode: formattedCode, tip });

  } catch (error) {
    // ... error handling ...
  }
}