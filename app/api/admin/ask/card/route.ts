import { Buffer } from "node:buffer";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { saveAskShareImage } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const form = await request.formData().catch(() => null);
  const id = form?.get("id");
  const revision = Number(form?.get("revision"));
  const image = form?.get("image");
  if (typeof id !== "string" || !Number.isSafeInteger(revision) || !(image instanceof File) || image.size > 768_000) {
    return Response.json({ error: "Invalid share card." }, { status: 400 });
  }
  const bytes = Buffer.from(await image.arrayBuffer());
  if (bytes.length < 24 || bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || bytes.readUInt32BE(16) !== 1200 || bytes.readUInt32BE(20) !== 630) {
    return Response.json({ error: "A 1200 by 630 PNG is required." }, { status: 400 });
  }
  const saved = await saveAskShareImage(id, revision, bytes.toString("base64"));
  return Response.json({ ok: saved }, { status: saved ? 200 : 409, headers: { "cache-control": "no-store" } });
}
