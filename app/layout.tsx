import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { absoluteUrl, seoProfile, SITE_URL } from "./seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Ahmed Salman Portfolio",
  authors: [{ name: seoProfile.name, url: SITE_URL }],
  creator: seoProfile.name,
  publisher: seoProfile.name,
  title: {
    default: seoProfile.title,
    template: `%s | ${seoProfile.name}`,
  },
  description: seoProfile.description,
  keywords: seoProfile.keywords,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: seoProfile.title,
    description: seoProfile.description,
    url: SITE_URL,
    siteName: "Ahmed Salman Portfolio",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Salman senior backend developer, gamer, and streamer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoProfile.title,
    description: seoProfile.description,
    images: ["/og.png"],
  },
  verification: {
    other: {
      profile: [absoluteUrl("/links")],
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
