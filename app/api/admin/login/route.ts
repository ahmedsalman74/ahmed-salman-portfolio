import { NextResponse } from "next/server";
import {
  adminCookieMaxAge,
  adminCookieName,
  createAdminSession,
  verifyAdminCredentials,
} from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  const username = body?.username ?? "";
  const password = body?.password ?? "";
  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid admin credentials." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const session = await createAdminSession(username.trim());
  response.cookies.set(adminCookieName(), session, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: adminCookieMaxAge(),
  });
  return response;
}
