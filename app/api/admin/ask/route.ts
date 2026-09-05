import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import {
  deleteAskQuestion,
  listAskQuestions,
  updateAskQuestion,
} from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ questions: await listAskQuestions() }, { headers: { "cache-control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    answer?: unknown;
    status?: unknown;
    showOnAsk?: unknown;
    showOnProfile?: unknown;
  } | null;

  if (typeof body?.id !== "string") {
    return NextResponse.json({ error: "Question id is required." }, { status: 400 });
  }

  await updateAskQuestion({
    id: body.id,
    answer: typeof body.answer === "string" ? body.answer : "",
    status: typeof body.status === "string" ? body.status : "new",
    showOnAsk: Boolean(body.showOnAsk),
    showOnProfile: Boolean(body.showOnProfile),
  });

  return NextResponse.json({ questions: await listAskQuestions() });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  if (typeof body?.id !== "string") {
    return NextResponse.json({ error: "Question id is required." }, { status: 400 });
  }

  await deleteAskQuestion(body.id);
  return NextResponse.json({ questions: await listAskQuestions() });
}
