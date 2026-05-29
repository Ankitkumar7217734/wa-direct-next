"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { COUNTRIES } from "@/lib/countries";
import {
  getRecent,
  saveRecent,
  clearRecent,
  type RecentEntry,
} from "@/lib/recent";
import { Toast } from "@/components/Toast";
import { InstallBanner } from "@/components/InstallBanner";
import { RecentList } from "@/components/RecentList";
import { Tips } from "@/components/Tips";

export default function Home() {
  const [cc, setCc] = useState("91");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [recent, setRecent] = useState<RecentEntry[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(getRecent());
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  function buildURL() {
    const cleanCC = cc.replace(/\D/g, "");
    const cleanNum = phone.replace(/\D/g, "");
    if (!cleanNum) return null;
    const full = cleanCC + cleanNum;
    return msg.trim()
      ? `https://wa.me/${full}?text=${encodeURIComponent(msg.trim())}`
      : `https://wa.me/${full}`;
  }

  function handleOpen() {
    const url = buildURL();
    if (!url) {
      showToast("Enter a phone number");
      phoneRef.current?.focus();
      return;
    }
    saveRecent(cc, phone);
    setRecent(getRecent());
    window.open(url, "_blank");
  }

  function handleCopy() {
    const url = buildURL();
    if (!url) {
      showToast("Enter a phone number");
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast("Link copied!"));
    } else {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      showToast("Link copied!");
    }
  }

  function handleClearRecent() {
    clearRecent();
    setRecent([]);
    showToast("Cleared");
  }

  function handleSelectRecent(recentCC: string, recentNum: string) {
    setCc(recentCC);
    setPhone(recentNum);
    setTimeout(() => {
      const cleanCC = recentCC.replace(/\D/g, "");
      const cleanNum = recentNum.replace(/\D/g, "");
      if (!cleanNum) return;
      const full = cleanCC + cleanNum;
      const url = msg.trim()
        ? `https://wa.me/${full}?text=${encodeURIComponent(msg.trim())}`
        : `https://wa.me/${full}`;
      saveRecent(recentCC, recentNum);
      setRecent(getRecent());
      window.open(url, "_blank");
    }, 0);
  }

  return (
    <>
      <div className="wa-wrap">
        <header className="wa-header">
          <div className="wa-logo-wrap">
            <div className="wa-logo-mark">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path
                  d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15c0 2.3.62 4.46 1.7 6.32L2.5 27.5l6.3-1.68A12.42 12.42 0 0015 27.5C21.9 27.5 27.5 21.9 27.5 15S21.9 2.5 15 2.5z"
                  fill="#030703"
                />
                <path
                  d="M20.8 17.9c-.32-.16-1.9-.94-2.2-1.05-.3-.1-.52-.16-.73.16s-.84 1.05-1.04 1.27c-.19.21-.38.24-.7.08-.32-.16-1.37-.5-2.6-1.6-.96-.86-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.54.1-.22.05-.41-.02-.57-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.54-.19 0-.4 0-.62 0s-.57.08-.86.4c-.3.32-1.14 1.12-1.14 2.72s1.17 3.16 1.33 3.38c.16.21 2.3 3.5 5.57 4.9.78.34 1.38.54 1.86.69.78.25 1.5.22 2.06.13.63-.1 1.93-.78 2.2-1.54.27-.76.27-1.4.19-1.54-.08-.13-.3-.22-.62-.38z"
                  fill="#030703"
                />
              </svg>
            </div>
            <div>
              <div className="wa-logo-title">
                WA<span>Direct</span>
              </div>
            </div>
          </div>
          <div className="wa-logo-sub">Open any chat without saving</div>
        </header>

        <div className="wa-card">
          <div className="wa-label">Phone Number</div>
          <div className="wa-phone-row">
            <select
              className="wa-cc-select"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} +{c.code}
                </option>
              ))}
            </select>
            <input
              ref={phoneRef}
              type="tel"
              className="wa-phone-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOpen()}
              placeholder="9876543210"
              autoComplete="tel-national"
              inputMode="numeric"
              autoFocus
            />
          </div>

          <div className="wa-msg-section">
            <div className="wa-label">
              Pre-fill Message <span className="wa-label-opt">(optional)</span>
            </div>
            <textarea
              className="wa-msg-input"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Hello! I wanted to reach out..."
            />
          </div>

          <div className="wa-btn-row">
            <button className="wa-btn-open" onClick={handleOpen}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="currentColor"
              >
                <path d="M9 1C4.58 1 1 4.58 1 9c0 1.4.36 2.74.99 3.9L1 17l4.17-1.06A7.97 7.97 0 009 17c4.42 0 8-3.58 8-8s-3.58-8-8-8z" />
              </svg>
              Open WhatsApp Chat
            </button>
            <button
              className="wa-btn-copy"
              title="Copy link"
              onClick={handleCopy}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <rect x="5.5" y="5.5" width="9" height="9" rx="2" />
                <path d="M10.5 5.5V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v6A1.5 1.5 0 003 10.5h2.5" />
              </svg>
            </button>
          </div>
        </div>

        <RecentList
          items={recent}
          onSelect={handleSelectRecent}
          onClear={handleClearRecent}
        />

        <InstallBanner onToast={showToast} />

        <Tips />

        <div className="wa-footer">
          wa.me link opener &middot; no data saved to server
        </div>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onHide={hideToast} />
    </>
  );
}
