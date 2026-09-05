"use client";

import { FormEvent, useState } from "react";

export default function AskForm() {
  const [status, setStatus] = useState("");
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
        setStatus("Question sent anonymously.");
      } else {
        setStatus("Question could not be sent. Try again with a little more detail.");
      }
    } catch {
      setStatus("You appear to be offline. Your question is still here; reconnect and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="askForm" onSubmit={handleSubmit}>
      <label>
        Ask anonymously
        <textarea
          dir="auto"
          name="question"
          maxLength={1200}
          minLength={8}
          placeholder="Ask about backend engineering, gaming, streaming, tools, career, or anything you want answered."
          required
        />
      </label>
      <input
        aria-hidden="true"
        className="askTrap"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <button className="buttonPrimary" disabled={submitting}>
        {submitting ? "Sending..." : "Send anonymous question"}
      </button>
      {status ? (
        <p className="askNotice" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
