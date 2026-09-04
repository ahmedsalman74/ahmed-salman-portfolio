"use client";

import { useMemo, useState } from "react";

type AskShareActionsProps = {
  question: string;
  answer: string;
  url: string;
};

export default function AskShareActions({
  question,
  answer,
  url,
}: AskShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const shareText = useMemo(
    () => `Anonymous question:\n${question}\n\nAhmed Salman:\n${answer}`,
    [answer, question],
  );
  const xText = truncate(`${question}\n\n${answer}`, 230);
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(url)}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`;

  async function copyStoryText() {
    await navigator.clipboard?.writeText(`${shareText}\n\n${url}`).catch(() => null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareNative() {
    if (navigator.share) {
      await navigator.share({ title: "Ahmed Salman answer", text: shareText, url }).catch(() => null);
      return;
    }

    await copyStoryText();
  }

  return (
    <div className="askShareActions" aria-label="Share this answer">
      <a href={xUrl} rel="noreferrer" target="_blank">
        X
      </a>
      <a href={whatsAppUrl} rel="noreferrer" target="_blank">
        WhatsApp
      </a>
      <button type="button" onClick={shareNative}>
        Story share
      </button>
      <button type="button" onClick={copyStoryText}>
        {copied ? "Copied" : "Copy text"}
      </button>
    </div>
  );
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}
