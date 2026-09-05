"use client";

import { useState } from "react";
import { createAnswerImage } from "./share-image";
import { questionAnswerText, tweetQuestionAnswer } from "./share-text";

type AskShareActionsProps = {
  question: string;
  answer: string;
  url: string;
  showOpenCard?: boolean;
};

export default function AskShareActions({
  question,
  answer,
  url,
  showOpenCard = false,
}: AskShareActionsProps) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const shareText = questionAnswerText(question, answer);
  const xText = tweetQuestionAnswer(question, answer);
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}&url=${encodeURIComponent(url)}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${url}`)}`;

  async function copyStoryText() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      setStatus("Copied.");
    } catch {
      setStatus("Copy is unavailable in this browser.");
    }
  }

  async function shareImage() {
    setBusy(true);
    setStatus("");
    try {
      const blob = await createAnswerImage({ question, answer }, true);
      const file = new File([blob], "question-and-answer.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Question & answer" });
      } else {
        const imageUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = file.name;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(imageUrl), 30_000);
        setStatus("Story image downloaded.");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setStatus("Could not share the image. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="askShareActions" aria-label="Share this answer">
      {showOpenCard ? (
        <a href={url} target="_blank" rel="noreferrer">
          <OpenIcon />
          Open card
        </a>
      ) : null}
      <a href={xUrl} rel="noreferrer" target="_blank">
        <XIcon />X
      </a>
      <a href={whatsAppUrl} rel="noreferrer" target="_blank">
        <WhatsAppIcon />
        WhatsApp
      </a>
      <button type="button" onClick={shareImage} disabled={busy}>
        <ImageIcon />
        {busy ? "Creating image…" : "Story image"}
      </button>
      <button type="button" onClick={copyStoryText}>
        <CopyIcon />
        Copy
      </button>
      {status ? <span className="askShareStatus" role="status">{status}</span> : null}
    </div>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-6.6L5.6 22H2.5l7.5-8.6L2 2h6.5l4.6 6.1L18.9 2Zm-1.1 18h1.8L7 4H5l12.8 16Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.2 1.3 1.1 2 .1 2.4.2l.6.7c.5.2 1.6.8 1.8 1 .3.1.4.1.5.3v1Z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}
