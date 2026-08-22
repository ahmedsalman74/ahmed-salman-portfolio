import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { CURRENT_CV_KEY, saveCvMetadata } from "@/app/lib/content-store";
import { getRuntimeEnv } from "@/app/lib/runtime";

export const dynamic = "force-dynamic";

const MAX_CV_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bucket = getRuntimeEnv().CV_BUCKET;
  if (!bucket) {
    return NextResponse.json(
      { error: "CV storage is not configured." },
      { status: 500 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("cv");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Attach a PDF file." }, { status: 400 });
  }
  if (file.size > MAX_CV_BYTES) {
    return NextResponse.json(
      { error: "CV PDF must be 8MB or smaller." },
      { status: 400 },
    );
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }

  await bucket.put(CURRENT_CV_KEY, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: "application/pdf",
      contentDisposition: "inline",
    },
    customMetadata: {
      filename: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });
  await saveCvMetadata({
    filename: file.name,
    contentType: "application/pdf",
    size: file.size,
  });

  return NextResponse.json({ ok: true });
}
