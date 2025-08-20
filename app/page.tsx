"use client";

import { useState } from "react";
import { TipDisplay } from "@/components/TipDisplay";
import { ConvertButton } from "@/components/ConvertButton";
import { Footer } from "@/components/Footer";
import { InputArea } from "@/components/InputArea";
import { OutputArea } from "@/components/OutputArea";
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

import prettier from "prettier/standalone";
import * as prettierPluginHtml from "prettier/plugins/html";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tip, setTip] = useState("");

  const [loadingMessage, setLoadingMessage] = useState("Convert to Tailwind CSS");

  const handleClear = () => {
    setInputCode("");
    setOutputCode("");
    setTip("");
  };

   const handleConvert = async () => {
    setIsLoading(true);
    setOutputCode("");
    setTip("");
    setLoadingMessage("Waking up the AI server..."); // Initial message 

    let response;
    let success = false;
    const maxRetries = 3; // We will try up to 3 times

    for (let i = 0; i < maxRetries; i++) {
      try {
        response = await fetch("/api/refactor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: inputCode }),
        });

        if (response.ok) {
          success = true;
          setLoadingMessage("Refactoring..."); // Update message on success
          break; // Exit the loop if the request was successful
        }
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed. Retrying...`);
      }

      // If not successful, wait 2 seconds before the next retry
      if (i < maxRetries - 1) {
        await sleep(2000);
      }
    }

    if (!success || !response) {
      setOutputCode("Error: The server is not responding. Please try again in a moment.");
      setIsLoading(false);
      setLoadingMessage("Convert to Tailwind CSS");
      return;
    }

    try {
      const data = await response.json();
      let refactoredCode = "";

      try {
        const cleanedJsonString = data.aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedJson = JSON.parse(cleanedJsonString);
        refactoredCode = parsedJson.refactoredCode || "";
        setTip(parsedJson.tip || "");
      } catch (e) {
        refactoredCode = data.aiResponseText;
        setTip("Tip could not be generated as the AI response was not in the expected format.");
      }

      const formattedCode = await prettier.format(refactoredCode, {
        parser: "html",
        plugins: [prettierPluginHtml],
      });
      
      setOutputCode(formattedCode);
    } catch (error) {
      setOutputCode("Error: Failed to process the AI response.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("Convert to Tailwind CSS");
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-sky-950 text-slate-800 dark:text-slate-200 transition-colors">
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeSwitcher />
      </header>
       <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col">
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            AI Tailwind Refactor Copilot!
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto dark:text-slate-300">
            Paste your messy HTML or CSS, and let our AI refactor it into clean, best-practice Tailwind CSS code.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 flex-grow">
          <InputArea value={inputCode} onChange={setInputCode} />
          <OutputArea value={outputCode} />
        </div>
        <TipDisplay tip={tip} />
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ConvertButton 
            onClick={handleConvert} 
            isLoading={isLoading} 
            loadingMessage={loadingMessage} 
          />

          {(inputCode || outputCode) && (
            <button
              onClick={handleClear}
              className="px-8 py-3 font-semibold rounded-md text-blue-600 dark:text-slate-300 bg-blue-100 dark:bg-slate-700 hover:bg-blue-200 dark:hover:bg-slate-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}