"use client";

import { useMemo, useState } from "react";
import PlatformIcon from "../PlatformIcon";
import { inferPlatformId } from "../link-platforms";
import type { LinkPageSocial } from "../profile-data";
import AskForm from "./AskForm";
import AskHeader from "./AskHeader";
import AskShareActions from "./AskShareActions";

type PublicQuestion = {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
  updatedAt?: number;
};

type AskExperienceProps = {
  profile: {
    name: string;
    role: string;
    summary: string;
  };
  linkProfile: {
    handle: string;
    bio: string;
    avatarText: string;
    avatarImage: string;
    showVerifiedBadge: boolean;
    socials: LinkPageSocial[];
  };
  questions: PublicQuestion[];
  siteUrl: string;
};

type SortOrder = "recent" | "oldest";

export default function AskExperience({
  profile,
  linkProfile,
  questions,
  siteUrl,
}: AskExperienceProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("recent");

  const visibleQuestions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const matches = normalized
      ? questions.filter((item) =>
          `${item.question} ${item.answer}`.toLocaleLowerCase().includes(normalized),
        )
      : questions;
    const direction = sort === "recent" ? -1 : 1;
    return [...matches].sort((a, b) => direction * (a.createdAt - b.createdAt));
  }, [query, questions, sort]);

  const socials = linkProfile.socials.filter((item) => item.enabled && safeHref(item.url));
  const initials = initialsOf(linkProfile.avatarText, profile.name);
  const answerAuthor = profile.name.split(" ")[0] || profile.name;

  return (
    <div className="askRoot">
      <AskHeader askHref="#ask" />

      <section className="askIntro" aria-labelledby="ask-profile-title">
        <div className="askWrap">
          <div className="askIntroAvatar">
            {linkProfile.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={linkProfile.avatarImage} alt="" />
            ) : (
              <span aria-hidden="true">{initials}</span>
            )}
          </div>
          <p className="askIntroHandle">@{linkProfile.handle || "ahmedsalman74"}</p>
          <h1 className="askIntroName" id="ask-profile-title">
            {profile.name}
            {linkProfile.showVerifiedBadge ? <VerifiedBadge /> : null}
          </h1>
          <p className="askIntroTag">{profile.role}</p>
          <p className="askIntroStats">
            <b>{questions.length}</b>
            <span>
              public {questions.length === 1 ? "answer" : "answers"} · Anonymous and
              reviewed before publishing
            </span>
          </p>
          <div className="askIntroActions">
            <a className="askBtn askBtnPrimary askBtnLg" href="#ask">Ask anonymously</a>
          </div>
        </div>
      </section>

      <main className="askWrap askMain">
        <section className="askCompose" id="ask" aria-labelledby="ask-form-title">
          <h2 id="ask-form-title">Ask {answerAuthor} anything</h2>
          <p>Questions are anonymous and reviewed before they appear publicly.</p>
          <AskForm />
        </section>

        <div className="askFeedHead">
          <h2 id="answers-title">Answers</h2>
          <p>Thoughts, one question at a time.</p>
          <div className="askToolbar">
            <div className="askSegmented" role="tablist" aria-label="Sort answers">
              {(["recent", "oldest"] as const).map((order) => (
                <button
                  className="askSeg"
                  key={order}
                  type="button"
                  role="tab"
                  aria-selected={sort === order}
                  onClick={() => setSort(order)}
                >
                  {order === "recent" ? "Recent" : "Oldest"}
                </button>
              ))}
            </div>
            <label className="askSearchBox">
              <span className="srOnly">Search public answers</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search…"
              />
            </label>
          </div>
        </div>

        {visibleQuestions.length ? (
          <div className="askThread" aria-labelledby="answers-title">
            {visibleQuestions.map((item) => (
              <article className="askCard" id={item.id} key={item.id}>
                <div className="askCardHead">
                  <span className="askCardBadge" aria-hidden="true">?</span>
                  <span className="askCardWho">
                    <b>Anonymous</b> ·{" "}
                    <time dateTime={new Date(item.createdAt).toISOString()}>
                      {formatDate(item.createdAt)}
                    </time>
                  </span>
                </div>
                <p className="askCardQuestion" dir="auto">{item.question}</p>
                <div className="askCardAnswer">
                  <span className="askCardAnswerLabel">
                    <span className="askCardAnswerAvatar" aria-hidden="true">
                      {linkProfile.avatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={linkProfile.avatarImage} alt="" />
                      ) : (
                        initials
                      )}
                    </span>
                    {answerAuthor}
                  </span>
                  <div className="askCardAnswerText" dir="auto">{item.answer}</div>
                </div>
                <AskShareActions
                  answer={item.answer}
                  question={item.question}
                  url={`${siteUrl}/ask/${item.id}?v=${item.updatedAt ?? item.createdAt}`}
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="askNoResults">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
            <h3>{query ? "No answers match that search" : "No public answers yet"}</h3>
            <p>
              {query
                ? `Try a different word, or ask ${answerAuthor} something new above.`
                : `Be the first to ask ${answerAuthor} something.`}
            </p>
          </div>
        )}
      </main>

      <section className="askAboutBand" aria-labelledby="ask-about-title">
        <div className="askWrap">
          <div className="askAboutPhoto">
            {linkProfile.avatarImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={linkProfile.avatarImage} alt="" />
            ) : (
              <span aria-hidden="true">{initials}</span>
            )}
          </div>
          <div>
            <p className="askAboutKicker">About</p>
            <h2 className="askAboutName" id="ask-about-title">{profile.name}</h2>
            <p className="askAboutBio">{linkProfile.bio || profile.summary}</p>
            {socials.length ? (
              <nav className="askAboutSocials" aria-label="Ahmed Salman social profiles">
                {socials.slice(0, 7).map((item) => (
                  <a
                    href={safeHref(item.url)}
                    key={`${item.label}-${item.url}`}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={item.label}
                  >
                    <PlatformIcon platformId={inferPlatformId(item)} fallback={item.icon} />
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <svg className="askIntroVerified" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Verified">
      <path d="M12 2 9.6 4.1 6.5 3.8 5.4 6.7 2.6 8l.6 3.1L1.4 13l1.8 2.6-.6 3 2.8 1.3.9 3 3.2-.4 2.5 2 2.5-2 3.1.4 1-3 2.8-1.3-.7-3L22.6 13l-1.8-1.9.6-3.1-2.8-1.3-1.1-2.9-3.1.3Z" />
      <path d="M10.6 15.2 7.8 12.4l1.2-1.2 1.6 1.6 3.6-3.7 1.2 1.2Z" fill="var(--ask-bg)" />
    </svg>
  );
}

function initialsOf(avatarText: string, name: string) {
  if (avatarText) return avatarText;
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function safeHref(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:"].includes(url.protocol) ? value : "";
  } catch {
    return "";
  }
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
