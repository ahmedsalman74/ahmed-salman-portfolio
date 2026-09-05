"use client";
import { useEffect } from "react";

export default function AskPwa() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/ask-sw.js", { scope: "/ask", updateViaCache: "none" }).catch(() => undefined);
    }
  }, []);
  return null;
}
