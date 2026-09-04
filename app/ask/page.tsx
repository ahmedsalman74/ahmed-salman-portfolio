import type { Metadata } from "next";
import Link from "next/link";
import AskForm from "./AskForm";
import AskShareActions from "./AskShareActions";
import { getPortfolioContent, listPublicAskQuestions } from "../lib/content-store";
import { absoluteUrl, seoProfile } from "../seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ask Ahmed Salman Anonymously",
  description:
    "Ask Ahmed Salman anonymous questions about backend engineering, gaming, streaming, new games, and new technologies.",
  keywords: [
    ...seoProfile.keywords,
    "ask Ahmed Salman anonymously",
    "anonymous questions Ahmed Salman",
  ],
  alternates: {
    canonical: "/ask",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Ask Ahmed Salman Anonymously",
    description:
      "Anonymous questions and public answers from Ahmed Salman about backend engineering, gaming, streaming, and new technologies.",
    url: absoluteUrl("/ask"),
    type: "website",
    siteName: "Ahmed Salman Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ask Ahmed Salman anonymously",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Ahmed Salman Anonymously",
    description:
      "Anonymous Q&A with Ahmed Salman about software engineering, gaming, streaming, and technology.",
    images: ["/og.png"],
  },
};

export default async function AskPage() {
  const [{ profile }, questions] = await Promise.all([
    getPortfolioContent(),
    listPublicAskQuestions(),
  ]);
  const pageJsonLd = jsonLd({
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": absoluteUrl("/ask#qa"),
    url: absoluteUrl("/ask"),
    name: "Ask Ahmed Salman anonymously",
    description:
      "Anonymous questions answered by Ahmed Salman about backend software engineering, gaming, streaming, and new technologies.",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      "@id": absoluteUrl(`/ask/${item.id}`),
      name: item.question,
      dateCreated: new Date(item.createdAt).toISOString(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
        dateCreated: new Date(item.answeredAt ?? item.updatedAt).toISOString(),
        author: {
          "@type": "Person",
          name: profile.name,
        },
      },
    })),
  });

  return (
    <main className="askPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageJsonLd }}
      />
      <section className="askShell">
        <header className="askHero">
          <Link className="backLink" href="/links">
            Back to links
          </Link>
          <p className="kicker">Anonymous Q&A</p>
          <h1>Ask Ahmed anything.</h1>
          <p>
            Send a question without your name. Published replies appear here only after Ahmed answers and approves them.
          </p>
        </header>

        <div className="askGrid">
          <section className="askPanel askSubmitPanel">
            <AskForm />
          </section>

          <section className="askPanel">
            <p className="kicker">Public Answers</p>
            <h2>Answered questions</h2>
            {questions.length ? (
              <div className="askAnswerList">
                {questions.map((item) => (
                  <article className="askAnswerCard" id={item.id} key={item.id}>
                    <p className="askQuestion">{item.question}</p>
                    <p className="askAnswer">{item.answer}</p>
                    <AskShareActions
                      answer={item.answer}
                      question={item.question}
                      url={absoluteUrl(`/ask/${item.id}`)}
                    />
                  </article>
                ))}
              </div>
            ) : (
              <p className="askEmpty">No public answers yet.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
