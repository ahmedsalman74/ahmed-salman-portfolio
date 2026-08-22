import { CURRENT_CV_KEY } from "@/app/lib/content-store";
import { getRuntimeEnv } from "@/app/lib/runtime";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const bucket = getRuntimeEnv().CV_BUCKET;
  if (!bucket) {
    return Response.redirect(new URL("/cv.pdf", request.url), 302);
  }

  const object = await bucket.get(CURRENT_CV_KEY);
  if (!object?.body) {
    return Response.redirect(new URL("/cv.pdf", request.url), 302);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", headers.get("content-type") ?? "application/pdf");
  headers.set("content-disposition", "inline; filename=\"ahmed-salman-cv.pdf\"");
  headers.set("cache-control", "public, max-age=120");
  return new Response(object.body, { headers });
}
