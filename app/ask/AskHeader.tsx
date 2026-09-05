"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation avoids Vinext prefetch failures. */

export default function AskHeader({ askHref }: { askHref: string }) {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.askTheme === "dark" ? "light" : "dark";
    root.dataset.askTheme = next;
    try {
      localStorage.setItem("ask-theme", next);
    } catch {
      /* Storage is unavailable in private mode; the toggle still works for this visit. */
    }
  }

  return (
    <header className="askHeader">
      <div className="askWrap">
        <a className="askBrandLink" href="/ask" aria-label="Ask Ahmed Salman anonymously">
          <span className="askBrandMark" aria-hidden="true">?</span>
          <span className="askBrandName">
            ask <span>ahmed</span>
          </span>
        </a>
        <a className="askNavLink" href="/">Portfolio</a>
        <a className="askNavLink" href="/links">Links</a>
        <button
          className="askIconBtn"
          type="button"
          onClick={toggleTheme}
          aria-label="Switch between light and dark"
          title="Switch between light and dark"
        >
          <svg
            className="askIconMoon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
          <svg
            className="askIconSun"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
        <a className="askBtn askBtnPrimary" href={askHref}>Ask a question</a>
      </div>
    </header>
  );
}
