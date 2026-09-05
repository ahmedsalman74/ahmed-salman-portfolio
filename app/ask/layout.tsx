import type { Metadata, Viewport } from "next";
import AskPwa from "./AskPwa";
import "./ask-app.css";

export const metadata: Metadata = {
  applicationName: "Ask Ahmed",
  manifest: "/ask/app.webmanifest",
  appleWebApp: { capable: true, title: "Ask Ahmed", statusBarStyle: "black-translucent" },
  icons: { icon: "/ask/icon-192.png", apple: "/ask/apple-touch-icon.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b121b" };

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return <><AskPwa />{children}</>;
}
