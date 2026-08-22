"use client";

import { useState } from "react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function shareProfile() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: document.title, url }).catch(() => null);
      return;
    }

    await navigator.clipboard?.writeText(url).catch(() => null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="linksShare" type="button" onClick={shareProfile}>
      {copied ? "Copied" : "Share"}
    </button>
  );
}
