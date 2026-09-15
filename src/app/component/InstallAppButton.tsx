"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
  }>;
}

export default function InstallAppButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(
        event as BeforeInstallPromptEvent
      );

      setShowButton(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;

    await installPrompt.prompt();

    const { outcome } =
      await installPrompt.userChoice;

    if (outcome === "accepted") {
      setShowButton(false);
    }

    setInstallPrompt(null);
  }

  if (!showButton) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="
        fixed
        bottom-5
        right-5
        z-[9999]
        flex
        items-center
        gap-3
        rounded-full
        bg-[#174c32]
        px-5
        py-3
        text-white
        shadow-2xl
        shadow-[#174c32]/30
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-[#103b27]
        hover:shadow-[#174c32]/40
        active:scale-95
      "
      aria-label="تحميل التطبيق"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8a84e] text-lg">
        📲
      </span>

      <span className="text-sm font-black">
        تحميل التطبيق
      </span>
    </button>
  );
}