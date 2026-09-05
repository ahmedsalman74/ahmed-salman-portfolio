type ShareContent = { question: string; answer: string };

export async function createAnswerImage(content: ShareContent, story = false): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = story ? 1080 : 1200;
  canvas.height = story ? 1920 : 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable in this browser.");
  const { width, height } = canvas;
  ctx.fillStyle = "#131019";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#8f72ff";
  ctx.fillRect(0, 0, width, 8);
  const margin = story ? 72 : 60;
  const textWidth = width - margin * 2;
  const top = story ? 210 : 44;
  const questionHeight = story ? 610 : 210;
  const answerTop = top + questionHeight + (story ? 95 : 70);
  ctx.textBaseline = "top";
  drawLabel(ctx, "QUESTION", margin, top);
  drawText(ctx, content.question, margin, top + 40, textWidth, questionHeight - 40, story ? 52 : 40);
  ctx.fillStyle = "#3a3350";
  ctx.fillRect(margin, answerTop - 26, textWidth, 2);
  drawLabel(ctx, "ANSWER", margin, answerTop);
  drawText(ctx, content.answer, margin, answerTop + 40, textWidth, height - answerTop - (story ? 230 : 76), story ? 48 : 36);
  return new Promise((resolve, reject) => canvas.toBlob(
    (blob) => blob ? resolve(blob) : reject(new Error("Could not create the share image.")),
    "image/png",
  ));
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.font = "bold 22px Arial, sans-serif";
  ctx.fillStyle = "#8f72ff";
  ctx.fillText(text, x, y);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, height: number, initialSize: number) {
  const rtl = /[\u0600-\u06ff]/.test(text);
  let size = initialSize;
  let lines: string[] = [];
  for (; size >= 22; size -= 2) {
    ctx.font = `${size}px Arial, sans-serif`;
    lines = wrap(ctx, text, width);
    if (lines.length * size * 1.5 <= height) break;
  }
  size = Math.max(22, size);
  ctx.font = `${size}px Arial, sans-serif`;
  const maxLines = Math.max(1, Math.floor(height / (size * 1.5)));
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(`${last}...`).width > width) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last}...`;
  }
  ctx.fillStyle = "#efedf6";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  lines.forEach((line, index) => ctx.fillText(line, rtl ? x + width : x, y + index * size * 1.5));
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      if (line && ctx.measureText(`${line} ${word}`).width > width) {
        lines.push(line);
        line = "";
      }
      for (const character of `${line ? " " : ""}${word}`) {
        if (ctx.measureText(line + character).width > width) {
          lines.push(line);
          line = "";
        }
        line += character;
      }
    }
    lines.push(line);
  }
  return lines;
}

export async function uploadAnswerImage(question: ShareContent & { id: string; updatedAt: number }) {
  const image = await createAnswerImage(question);
  const form = new FormData();
  form.set("id", question.id);
  form.set("revision", String(question.updatedAt));
  form.set("image", image, "answer.png");
  const response = await fetch("/api/admin/ask/card", { method: "POST", body: form });
  if (!response.ok) throw new Error("The reply was saved, but its share card needs to be refreshed.");
}
