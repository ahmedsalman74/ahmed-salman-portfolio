"use client";

import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setError("Invalid username or password.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <section className="adminLogin">
      <a className="backLink" href="/">
        Back to portfolio
      </a>
      <form onSubmit={handleSubmit}>
        <p className="kicker">SaaS Admin</p>
        <h1>Portfolio Control Room</h1>
        <p>
          Sign in to manage projects, experience, site copy, tickets, and the
          CV PDF.
        </p>
        <label>
          Username
          <input name="username" defaultValue="Ahmed Salman 74" autoComplete="username" />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" />
        </label>
        {error ? <span className="formError">{error}</span> : null}
        <button className="buttonPrimary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
