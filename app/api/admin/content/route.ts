import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import {
  getPortfolioContent,
  savePortfolioContent,
} from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ content: await getPortfolioContent() });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  const content = "content" in body ? body.content : body;
  const saved = await savePortfolioContent(content);
  return NextResponse.json({ content: saved });
}
