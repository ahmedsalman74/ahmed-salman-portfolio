import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import {
  deleteTicket,
  listTickets,
  updateTicketStatus,
} from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({ tickets: await listTickets() });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    status?: string;
  } | null;
  if (!body?.id || !body.status) {
    return NextResponse.json({ error: "Invalid ticket update." }, { status: 400 });
  }

  await updateTicketStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
  } | null;
  if (!body?.id) {
    return NextResponse.json({ error: "Invalid ticket delete." }, { status: 400 });
  }

  await deleteTicket(body.id);
  return NextResponse.json({ ok: true });
}
