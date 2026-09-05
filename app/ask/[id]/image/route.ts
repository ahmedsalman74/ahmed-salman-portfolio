import { Buffer } from "node:buffer";
import { getPublicAskShareImage } from "@/app/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const image = await getPublicAskShareImage(params.id);
  if (!image) return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  return new Response(Buffer.from(image.image, "base64"), {
    headers: { "content-type": "image/png", "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
}
