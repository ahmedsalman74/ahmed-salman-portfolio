import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioContent } from "../lib/content-store";
import { seoProfile } from "../seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ahmed Salman CV | Senior Backend Developer",
  description:
    "PDF CV preview for Ahmed Salman, senior backend developer known as ahmedsalman74 and ahmedsalman72.",
  keywords: seoProfile.keywords,
  alternates: {
    canonical: "/cv",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CvPage() {
  const { profile } = await getPortfolioContent();

  return (
    <main className="cvPdfPage">
      <header className="cvPdfHeader">
        <Link className="backLink" href="/">
          Back to portfolio
        </Link>
        <div>
          <p className="kicker">PDF CV</p>
          <h1>{profile.name}</h1>
          <p>{profile.role}</p>
        </div>
        <Link className="buttonSecondary" href="/">
          Portfolio
        </Link>
      </header>
      <section className="pdfFrame" aria-label="Ahmed Salman CV PDF">
        <iframe title="Ahmed Salman CV PDF" src="/api/cv/file" />
      </section>
    </main>
  );
}
