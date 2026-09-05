import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans_Arabic, Onest } from "next/font/google";
import AskPwa from "./AskPwa";
import "./ask-app.css";
import "./ask-theme.css";

const askDisplay = Bricolage_Grotesque({
  variable: "--font-ask-display",
  subsets: ["latin"],
  display: "swap",
});

const askUi = Onest({
  variable: "--font-ask-ui",
  subsets: ["latin"],
  display: "swap",
});

const askArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ask-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Runs before first paint so the stored theme never flashes the wrong palette. */
const themeScript = `try{var t=localStorage.getItem("ask-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.askTheme=t}catch(e){}`;

export const metadata: Metadata = {
  applicationName: "Ask Ahmed",
  manifest: "/ask/app.webmanifest",
  appleWebApp: { capable: true, title: "Ask Ahmed", statusBarStyle: "black-translucent" },
  icons: { icon: "/ask/icon-192.png", apple: "/ask/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2f8" },
    { media: "(prefers-color-scheme: dark)", color: "#131019" },
  ],
};

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${askDisplay.variable} ${askUi.variable} ${askArabic.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <AskPwa />
      {children}
    </div>
  );
}
