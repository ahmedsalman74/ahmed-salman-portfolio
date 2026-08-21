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
  title: "Ahmed Salman | Senior Software Engineer",
  description:
    "Elegant portfolio for Ahmed Salman, a senior software engineer focused on reliable software products, modern web platforms, architecture, and technical leadership.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Ahmed Salman | Senior Software Engineer",
    description:
      "Senior software engineer building reliable products, scalable platforms, and clean engineering systems.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Salman senior software engineer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Salman | Senior Software Engineer",
    description:
      "Senior software engineer building reliable products, scalable platforms, and clean engineering systems.",
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
