import type { Metadata } from "next";
import { isAdminPageRequest } from "@/app/lib/admin-auth";
import AdminLogin from "@/app/admin/AdminLogin";
import AskDashboard from "./AskDashboard";
import { listAskQuestions } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private Ask Dashboard",
  robots: { index: false, follow: false },
  manifest: "/ask/admin/app.webmanifest",
  appleWebApp: { capable: true, title: "Ask Inbox", statusBarStyle: "black-translucent" },
};

export default async function AskAdminPage() {
  const authenticated = await isAdminPageRequest();
  const questions = authenticated ? await listAskQuestions() : [];
  return <main className="askAdminPage">{authenticated ? <AskDashboard initialQuestions={questions} /> : <AdminLogin askOnly />}</main>;
}
