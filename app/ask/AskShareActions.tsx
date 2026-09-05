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
      {showOpenCard ? <a href={url} target="_blank" rel="noreferrer">Open card</a> : null}
      <a href={xUrl} rel="noreferrer" target="_blank">
        X
      </a>
      <a href={whatsAppUrl} rel="noreferrer" target="_blank">
        WhatsApp
      </a>
      <button type="button" onClick={shareImage} disabled={busy}>
        {busy ? "Creating image..." : "Share story image"}
      </button>
      <button type="button" onClick={copyStoryText}>
        Copy text
      </button>
      {status ? <span className="askShareStatus" role="status">{status}</span> : null}
    </div>
  );
}
