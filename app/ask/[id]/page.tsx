/* eslint-disable @next/next/no-html-link-for-pages -- Vinext link prefetch fails on Cloudflare Pages. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AskHeader from "../AskHeader";
import AskShareActions from "../AskShareActions";
import { getPublicAskQuestion } from "@/app/lib/content-store";
import { absoluteUrl, seoProfile } from "@/app/seo";

export const dynamic = "force-dynamic";

type AskAnswerPageProps = {
  params: { id: string };
};

export async function generateMetadata({
  params,
}: AskAnswerPageProps): Promise<Metadata> {
  const question = await getPublicAskQuestion(params.id);
  if (!question) {
    return {
      title: "Ahmed Salman Q&A",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `Question: ${truncate(question.question, 90)}`;
  const description = `Answer: ${truncate(question.answer, 240)}`;
  const imageUrl = absoluteUrl(`/ask/${question.id}/image?v=${question.updatedAt}`);

  return {
    title,
    description,
    keywords: seoProfile.keywords,
    alternates: {
      canonical: `/ask/${question.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/ask/${question.id}`),
      type: "article",
      siteName: "Ahmed Salman Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function AskAnswerPage({ params }: AskAnswerPageProps) {
  const question = await getPublicAskQuestion(params.id);
  if (!question) notFound();
  const url = absoluteUrl(`/ask/${question.id}?v=${question.updatedAt}`);
  const author = seoProfile.name.split(" ")[0];

  return (
    <div className="askRoot">
      <AskHeader askHref="/ask#ask" />

      <main className="askWrap askDetail">
        <a className="askBack" href="/ask">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          All questions
        </a>

        <article className="askCard">
          <div className="askCardHead">
            <span className="askCardBadge" aria-hidden="true">?</span>
            <span className="askCardWho">
              <b>Anonymous</b> ·{" "}
              <time dateTime={new Date(question.createdAt).toISOString()}>
                {formatDate(question.createdAt)}
              </time>
            </span>
          </div>
          <h1 className="askCardQuestion" dir="auto">{question.question}</h1>
          <div className="askCardAnswer">
            <span className="askCardAnswerLabel">
              <span className="askCardAnswerAvatar" aria-hidden="true">AS</span>
              {author}
            </span>
            <div className="askCardAnswerText" dir="auto">{question.answer}</div>
          </div>
          <AskShareActions
            answer={question.answer}
            question={question.question}
            url={url}
          />
        </article>
      </main>
    </div>
  );
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
