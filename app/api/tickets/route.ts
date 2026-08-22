import { NextResponse } from "next/server";
import { createTicket } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  } | null;

  if (!body?.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json(
      { error: "Name, email, subject, and message are required." },
      { status: 400 },
    );
  }

  const id = await createTicket({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
  });

  return NextResponse.json({ ok: true, id });
}
