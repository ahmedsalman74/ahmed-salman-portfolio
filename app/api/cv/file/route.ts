import { CURRENT_CV_KEY } from "@/app/lib/content-store";
import { getRuntimeEnv } from "@/app/lib/runtime";

export const dynamic = "force-dynamic";

type CvMetadata = {
  contentType?: string;
  filename?: string;
};

export async function GET(request: Request) {
  const { CV_STORE: store, CV_BUCKET: bucket } = getRuntimeEnv();
  if (store) {
    const object = await store.getWithMetadata<CvMetadata>(
      CURRENT_CV_KEY,
      "arrayBuffer",
    );
    if (object.value) {
      return new Response(object.value, {
        headers: {
          "cache-control": "public, max-age=120",
          "content-disposition": `inline; filename="${object.metadata?.filename ?? "ahmed-salman-cv.pdf"}"`,
          "content-type": object.metadata?.contentType ?? "application/pdf",
        },
      });
    }
  }

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
