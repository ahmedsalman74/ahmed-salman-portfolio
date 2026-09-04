import { NextResponse } from "next/server";
import {
  createAskQuestion,
  listPublicAskQuestions,
} from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ questions: await listPublicAskQuestions() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    question?: unknown;
    website?: unknown;
  } | null;

  if (typeof body?.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (typeof body?.question !== "string" || body.question.trim().length < 8) {
    return NextResponse.json(
      { error: "Question must be at least 8 characters." },
      { status: 400 },
    );
  }

  const id = await createAskQuestion({ question: body.question });
  return NextResponse.json({ ok: true, id });
}
