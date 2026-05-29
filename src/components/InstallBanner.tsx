"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner({ onToast }: { onToast: (msg: string) => void }) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(navigator as { standalone?: boolean }).standalone;
    const standalone =
      (navigator as { standalone?: boolean }).standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    if (ios && !standalone) setIsIOS(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    const installedHandler = () => {
      setInstallPrompt(null);
      onToast("App installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [onToast]);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (result.outcome === "accepted") onToast("Installing...");
  }, [installPrompt, onToast]);

  if (!installPrompt && !isIOS) return null;

  return (
    <>
      {installPrompt && (
        <div className="wa-install-card">
          <div className="wa-install-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="#030703">
              <path
                d="M9 1v10M5 7l4 4 4-4M1 14v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                stroke="#030703"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="wa-install-text">
            <strong>Install as App</strong>
            <p>Works offline, opens from home screen</p>
          </div>
          <button className="wa-btn-install" onClick={handleInstall}>
            Install
          </button>
        </div>
      )}

      {isIOS && !installPrompt && (
        <div className="wa-ios-hint">
          <span>Install on iPhone:</span> Tap the Share button below, then{" "}
          <span>Add to Home Screen</span>
        </div>
      )}
    </>
  );
}
