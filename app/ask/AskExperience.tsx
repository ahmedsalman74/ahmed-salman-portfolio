"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Full navigation avoids Vinext prefetch failures. */

import { useMemo, useState, type CSSProperties } from "react";
import PlatformIcon from "../PlatformIcon";
import { getPlatformColor, inferPlatformId } from "../link-platforms";
import type { LinkPageSocial } from "../profile-data";
import AskForm from "./AskForm";
import AskShareActions from "./AskShareActions";

type PublicQuestion = {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
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

export default function AskExperience({
  profile,
  linkProfile,
  questions,
  siteUrl,
}: AskExperienceProps) {
  const [query, setQuery] = useState("");
  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return questions;
    return questions.filter((item) =>
      `${item.question} ${item.answer}`.toLocaleLowerCase().includes(normalized),
    );
  }, [query, questions]);
  const socials = linkProfile.socials.filter(
    (item) => item.enabled && safeHref(item.url),
  );

  return (
    <>
      <header className="askTopbar">
        <a className="askBrand" href="/ask" aria-label="Ahmed Salman anonymous questions">
          <span aria-hidden="true">?</span>
          <strong>ask</strong>ahmed
        </a>
        <label className="askSearch">
          <span className="srOnly">Search public answers</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search answers..."
          />
        </label>
        <nav aria-label="Ask page navigation">
          <a href="/">Portfolio</a>
          <a href="/links">Links</a>
          <a className="askNavCta" href="#ask-form">Ask a question</a>
        </nav>
      </header>

      <section className="askShell">
        <section className="askProfileHero" aria-labelledby="ask-profile-title">
          <Avatar
            image={linkProfile.avatarImage}
            initials={linkProfile.avatarText}
            name={profile.name}
          />
          <div className="askProfileCopy">
            <p>@{linkProfile.handle || "ahmedsalman74"}</p>
            <h1 id="ask-profile-title">
              {profile.name}
              {linkProfile.showVerifiedBadge ? <span aria-label="Verified">✓</span> : null}
            </h1>
            <p>{linkProfile.bio || profile.role}</p>
            <strong>{questions.length} public {questions.length === 1 ? "answer" : "answers"}</strong>
          </div>
          <a className="askHeroCta" href="#ask-form">Ask anonymously</a>
        </section>

        <div className="askContentGrid">
          <section className="askFeed" aria-labelledby="answers-title">
            <header className="askFeedHeader">
              <div>
                <p className="kicker">Public Q&A</p>
                <h2 id="answers-title">Answers</h2>
                <span>Thoughts, one question at a time.</span>
              </div>
              {query ? <strong>{filteredQuestions.length} found</strong> : <strong>Most recent</strong>}
            </header>

            {filteredQuestions.length ? (
              <div className="askAnswerList">
                {filteredQuestions.map((item) => (
                  <article className="askAnswerCard" id={item.id} key={item.id}>
                    <header>
                      <span className="askQuestionMark" aria-hidden="true">?</span>
                      <div>
                        <p className="askQuestion" dir="auto">{item.question}</p>
                        <time dateTime={new Date(item.createdAt).toISOString()}>
                          Anonymous · {formatDate(item.createdAt)}
                        </time>
                      </div>
                    </header>
                    <p className="askAnswer" dir="auto">{item.answer}</p>
                    <footer>
                      <span>Answered by Ahmed Salman</span>
                      <AskShareActions
                        answer={item.answer}
                        question={item.question}
                        url={`${siteUrl}/ask/${item.id}`}
                      />
                    </footer>
                  </article>
                ))}
              </div>
            ) : (
              <div className="askEmpty">
                <span aria-hidden="true">?</span>
                <h3>{query ? "No matching answers" : "No public answers yet"}</h3>
                <p>{query ? "Try a different search." : "Be the first to ask Ahmed something."}</p>
              </div>
            )}
          </section>

          <aside className="askSidebar" aria-label="About Ahmed and ask a question">
            <section className="askAbout">
              <span className="askAboutIcon" aria-hidden="true">AS</span>
              <p className="kicker">About me</p>
              <h2>{profile.name}</h2>
              <p>{profile.summary}</p>
              {socials.length ? (
                <nav className="askSocials" aria-label="Ahmed Salman social profiles">
                  {socials.slice(0, 7).map((item) => {
                    const platformId = inferPlatformId(item);
                    return (
                      <a
                        href={safeHref(item.url)}
                        key={`${item.label}-${item.url}`}
                        rel="noreferrer"
                        target="_blank"
                        aria-label={item.label}
                        style={{ "--platform-color": getPlatformColor(platformId) } as CSSProperties}
                      >
                        <PlatformIcon platformId={platformId} fallback={item.icon} />
                      </a>
                    );
                  })}
                </nav>
              ) : null}
            </section>

            <section className="askSubmitCard" id="ask-form">
              <p className="kicker">Your turn</p>
              <h2>What are you curious about?</h2>
              <p>Questions are anonymous and moderated before appearing publicly.</p>
              <AskForm />
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}

function Avatar({ image, initials, name }: { image: string; initials: string; name: string }) {
  return (
    <div className="askAvatar" aria-hidden="true">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" />
      ) : (
        <span>{initials || name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
      )}
    </div>
  );
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
