"use client";

import { FormEvent, useState } from "react";

const MAX_LENGTH = 1200;

export default function AskForm() {
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
  const [length, setLength] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: form.get("question"),
          website: form.get("website"),
        }),
      });

      if (response.ok) {
        formElement.reset();
        setLength(0);
        setTone("success");
        setStatus("Question sent — it'll appear here after review.");
      } else {
        setTone("error");
        setStatus("Question could not be sent. Try again with a little more detail.");
      }
    } catch {
      setTone("error");
      setStatus("You appear to be offline. Your question is still here; reconnect and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="srOnly" htmlFor="ask-question">
        Ask anonymously
      </label>
      <textarea
        className="askComposeField"
        dir="auto"
        id="ask-question"
        name="question"
        maxLength={MAX_LENGTH}
        minLength={8}
        onChange={(event) => setLength(event.target.value.length)}
        placeholder="Backend engineering, gaming, streaming, tools, career — whatever you're curious about."
        required
      />
      <input
        aria-hidden="true"
        className="askTrap"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <div className="askComposeFoot">
        <span className="askComposeHint">
          {length} / {MAX_LENGTH}
        </span>
        <button className="askBtn askBtnPrimary" disabled={submitting}>
          {submitting ? "Sending…" : "Send anonymous question"}
        </button>
      </div>
      {status ? (
        <p className="askComposeNotice" data-tone={tone} role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
