"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation for authenticated pages. */
import { useState } from "react";
import AskShareActions from "../AskShareActions";
import { uploadAnswerImage } from "../share-image";
import { absoluteUrl } from "@/app/seo";

type Question = {
  id: string;
  question: string;
  answer: string;
  status: string;
  showOnAsk: boolean;
  showOnProfile: boolean;
  createdAt: number;
  updatedAt: number;
};

export default function AskDashboard({ initialQuestions }: { initialQuestions: Question[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [filter, setFilter] = useState("new");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  function edit(id: string, patch: Partial<Question>) {
    setQuestions((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  async function save(question: Question, archive = false) {
    setBusy(question.id);
    setMessage("");
    try {
      const response = await fetch("/api/admin/ask", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...question, status: archive ? "archived" : question.answer.trim() ? "answered" : "new" }),
      });
      if (response.status === 401) throw new Error("Your session expired. Reload and sign in again.");
      if (!response.ok) throw new Error("Could not save your reply.");
      const data = await response.json() as { questions: Question[] };
      const saved = data.questions.find((item) => item.id === question.id);
      // Update this item only so replies being drafted in other cards stay intact.
      if (saved) edit(saved.id, saved);
      if (saved?.status === "answered" && saved.answer.trim()) await uploadAnswerImage(saved);
      setMessage(archive ? "Question archived." : "Reply and share card saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your reply.");
    } finally {
      setBusy("");
    }
  }

  async function refreshCards() {
    setBusy("cards");
    setMessage("");
    try {
      const response = await fetch("/api/admin/ask", { cache: "no-store" });
      if (response.status === 401) throw new Error("Your session expired. Reload and sign in again.");
      if (!response.ok) throw new Error("Could not load saved answers.");
      const data = await response.json() as { questions: Question[] };
      for (const question of data.questions.filter((item) => item.status === "answered" && item.answer.trim())) {
        await uploadAnswerImage(question);
      }
      setMessage("Share cards refreshed. New shared links use the question and answer image.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not refresh share cards.");
    } finally {
      setBusy("");
    }
  }

  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (response.ok) window.location.href = "/ask/admin";
  }

  const visible = questions.filter((item) =>
    (filter === "all" || item.status === filter) &&
    `${item.question} ${item.answer}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );

  return (
    <section className="askInbox">
      <header className="askInboxHeader">
        <div><p className="kicker">Private inbox</p><h1>Ask Dashboard</h1></div>
        <nav aria-label="Private dashboard navigation">
          <a href="/ask">Public page</a>
          <button type="button" onClick={logout}>Log out</button>
        </nav>
      </header>
      <div className="askInboxTools">
        <label><span className="srOnly">Search questions</span><input type="search" placeholder="Search questions..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <button type="button" disabled={Boolean(busy)} onClick={refreshCards}>{busy === "cards" ? "Creating cards..." : "Refresh share cards"}</button>
      </div>
      <nav className="askInboxFilters" aria-label="Question filters">
        {[["new", "Inbox"], ["answered", "Answered"], ["archived", "Archived"], ["all", "All"]].map(([value, label]) => (
          <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label} <span>{questions.filter((item) => value === "all" || item.status === value).length}</span>
          </button>
        ))}
      </nav>
      {message ? <p className="askInboxNotice" role="status">{message}</p> : null}
      {!visible.length ? <p className="askInboxEmpty">No questions here.</p> : (
        <div className="askInboxList">
          {visible.map((question) => (
            <article className="askInboxCard" key={question.id}>
              <header><span>{question.status}</span><time dateTime={new Date(question.createdAt).toISOString()}>{new Date(question.createdAt).toLocaleDateString()}</time></header>
              <h2 dir="auto">{question.question}</h2>
              <label>Answer<textarea dir="auto" maxLength={4000} value={question.answer} onChange={(event) => edit(question.id, { answer: event.target.value })} placeholder="Write your reply..." /></label>
              <div className="askInboxVisibility">
                <label><input type="checkbox" checked={question.showOnAsk} onChange={(event) => edit(question.id, { showOnAsk: event.target.checked })} />Publish on Ask</label>
                <label><input type="checkbox" checked={question.showOnProfile} onChange={(event) => edit(question.id, { showOnProfile: event.target.checked })} />Feature on links profile</label>
              </div>
              <div className="askInboxActions">
                <button className="buttonPrimary" type="button" disabled={Boolean(busy)} onClick={() => save(question)}>{busy === question.id ? "Saving..." : "Save reply"}</button>
                {question.status !== "archived" ? <button type="button" disabled={Boolean(busy)} onClick={() => save(question, true)}>Archive</button> : null}
              </div>
              {question.status === "answered" && question.answer.trim() && (question.showOnAsk || question.showOnProfile) ? (
                <AskShareActions question={question.question} answer={question.answer} url={absoluteUrl(`/ask/${question.id}?v=${question.updatedAt}`)} showOpenCard />
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
