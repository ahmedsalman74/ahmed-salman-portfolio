/* eslint-disable @next/next/no-html-link-for-pages -- Vinext link prefetch fails on Cloudflare Pages. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  return (
    <main className="askPage">
      <section className="askShell askDetailShell">
        <header className="askHero">
          <a className="backLink" href="/ask">
            All questions
          </a>
          <p className="kicker">Public Q&A</p>
          <h1>Question & answer</h1>
        </header>

        <article className="askAnswerCard askDetailCard">
          <span className="kicker">Question</span>
          <p className="askQuestion" dir="auto">{question.question}</p>
          <span className="kicker">Answer</span>
          <p className="askAnswer" dir="auto">{question.answer}</p>
          <AskShareActions
            answer={question.answer}
            question={question.question}
            url={url}
          />
        </article>
      </section>
    </main>
  );
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}
