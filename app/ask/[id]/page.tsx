import type { Metadata } from "next";
import Link from "next/link";
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

  const title = `Ahmed Salman answers: ${truncate(question.question, 64)}`;
  const description = truncate(question.answer, 155);

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
          url: "/og.png",
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
      images: ["/og.png"],
    },
  };
}

export default async function AskAnswerPage({ params }: AskAnswerPageProps) {
  const question = await getPublicAskQuestion(params.id);
  if (!question) notFound();
  const url = absoluteUrl(`/ask/${question.id}`);

  return (
    <main className="askPage">
      <section className="askShell askDetailShell">
        <header className="askHero">
          <Link className="backLink" href="/ask">
            All questions
          </Link>
          <p className="kicker">Shared Answer</p>
          <h1>Ahmed Salman answered this.</h1>
        </header>

        <article className="askAnswerCard askDetailCard">
          <p className="askQuestion">{question.question}</p>
          <p className="askAnswer">{question.answer}</p>
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
