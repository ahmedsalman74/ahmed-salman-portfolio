import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Ahmed Salman | Mid-Senior Backend Software Engineer",
  description:
    "Portfolio for Ahmed Salman, a mid-senior backend software engineer specializing in Node.js, TypeScript, microservices, cloud platforms, distributed systems, and performance tuning.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Ahmed Salman | Mid-Senior Backend Software Engineer",
    description:
      "Backend software engineer building scalable microservices, distributed systems, API platforms, and production cloud infrastructure.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Salman backend software engineer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Salman | Mid-Senior Backend Software Engineer",
    description:
      "Backend software engineer building scalable microservices, distributed systems, API platforms, and production cloud infrastructure.",
    images: ["/og.png"],
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
