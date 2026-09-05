"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin({ askOnly = false }: { askOnly?: boolean }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }
      window.location.href = askOnly ? "/ask/admin" : "/admin";
    } catch {
      setError("Could not sign in. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="adminLogin">
      <a className="backLink" href={askOnly ? "/ask" : "/"}>
        {askOnly ? "Back to Ask" : "Back to portfolio"}
      </a>
      <form onSubmit={handleSubmit}>
        <p className="kicker">{askOnly ? "Private inbox" : "SaaS Admin"}</p>
        <h1>{askOnly ? "Ask Dashboard" : "Portfolio Control Room"}</h1>
        <p>
          {askOnly ? "Sign in to read questions, reply, and choose what to publish." : "Sign in to manage projects, experience, site copy, tickets, and the CV PDF."}
        </p>
        <label>
          Username
          <input name="username" defaultValue="Ahmed Salman 74" autoComplete="username" autoCapitalize="none" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? <span className="formError">{error}</span> : null}
        <button className="buttonPrimary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
