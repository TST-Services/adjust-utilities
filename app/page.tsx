"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAdjustData = async () => {
      const adid = searchParams.get("adid");
      const adjustToken = searchParams.get("adjust-token");
      const url = searchParams.get("url");

      if (!adid || !adjustToken || !url) {
        console.error("Missing required parameters: adid, adjust-token, or url");
        setIsProcessing(false);
        return;
      }

      try {
        // Call API to get Adjust data and get redirect URL
        const response = await fetch("/api/process-adjust", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adid, adjustToken, url }),
        });

        const data = await response.json();

        if (response.ok && data.redirectUrl) {
          console.log("Redirecting to:", data.redirectUrl);
          // Redirect user to Keitaro URL
          window.location.href = data.redirectUrl;
        } else {
          console.error("Error processing:", data.error);
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Request failed:", error);
        setIsProcessing(false);
      }
    };

    processAdjustData();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Circular progress indicator */}
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50"></div>
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          {isProcessing ? "Processing..." : "Done"}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50"></div>
            </div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
