"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message"),
      }),
    });
    setSubmitting(false);
    if (response.ok) {
      event.currentTarget.reset();
      setStatus("Message sent. I will review it from the admin dashboard.");
    } else {
      setStatus("Message could not be sent. Please email me directly.");
    }
  }

  return (
    <form className="contactForm" onSubmit={handleSubmit}>
      <div>
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
      </div>
      <label>
        Subject
        <input name="subject" required />
      </label>
      <label>
        Message
        <textarea name="message" required />
      </label>
      <button className="buttonPrimary" disabled={submitting}>
        {submitting ? "Sending..." : "Send ticket"}
      </button>
      {status ? <p>{status}</p> : null}
    </form>
  );
}
