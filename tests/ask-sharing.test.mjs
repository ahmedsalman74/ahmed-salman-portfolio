import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { build } from "esbuild";

async function loadModule(entry, stubs = {}) {
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, platform: "node", format: "esm",
    plugins: [{ name: "test-boundaries", setup(builder) {
      builder.onResolve({ filter: /.*/ }, (args) => args.path in stubs ? { path: args.path, namespace: "stub" } : undefined);
      builder.onLoad({ filter: /.*/, namespace: "stub" }, (args) => ({ contents: stubs[args.path], loader: "js" }));
    } }],
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
}

test("share images respect saved revision, visibility, archive, and deletion", async () => {
  const sqlite = new DatabaseSync(":memory:");
  function prepare(sql) {
    let values = [];
    return {
      bind(...input) { values = input; return this; },
      async first() { return sqlite.prepare(sql).get(...values) ?? null; },
      async all() { return { results: sqlite.prepare(sql).all(...values) }; },
      async run() { return { meta: sqlite.prepare(sql).run(...values) }; },
    };
  }
  globalThis.askTestRuntime = { DB: { prepare, async batch(statements) { return Promise.all(statements.map((statement) => statement.run())); } } };
  const store = await loadModule("app/lib/content-store.ts", { "./runtime": "export const getRuntimeEnv = () => globalThis.askTestRuntime;" });
  try {
    const id = await store.createAskQuestion({ question: "A private question?" });
    assert.equal(await store.getPublicAskShareImage(id), null);
    await store.updateAskQuestion({ id, answer: "", status: "archived", showOnAsk: true, showOnProfile: true });
    assert.equal((await store.listAskQuestions())[0].status, "archived");
    await store.updateAskQuestion({ id, answer: "My reply", status: "answered", showOnAsk: true, showOnProfile: false });
    const saved = (await store.listAskQuestions())[0];
    assert.equal(await store.saveAskShareImage(id, saved.updatedAt - 1, "stale"), false);
    assert.equal(await store.saveAskShareImage(id, saved.updatedAt, "image"), true);
    assert.equal((await store.getPublicAskShareImage(id)).image, "image");
    sqlite.prepare("UPDATE ask_questions SET updated_at = updated_at + 1 WHERE id = ?").run(id);
    assert.equal(await store.getPublicAskShareImage(id), null);
    assert.equal(await store.saveAskShareImage(id, saved.updatedAt, "stale"), false);
    await store.saveAskShareImage(id, saved.updatedAt + 1, "new image");
    sqlite.prepare("UPDATE ask_questions SET show_on_ask = 0 WHERE id = ?").run(id);
    assert.equal(await store.getPublicAskShareImage(id), null);
    sqlite.prepare("UPDATE ask_questions SET show_on_profile = 1 WHERE id = ?").run(id);
    assert.equal((await store.getPublicAskShareImage(id)).image, "new image");
    await store.deleteAskQuestion(id);
    assert.equal(await store.getPublicAskShareImage(id), null);
    assert.equal(sqlite.prepare("SELECT count(*) AS n FROM ask_share_images").get().n, 0);
    const content = await store.getPortfolioContent();
    content.linkPage.highlightText = "";
    await store.savePortfolioContent(content);
    assert.equal((await store.getPortfolioContent()).linkPage.highlightText, "");
  } finally {
    sqlite.close();
    delete globalThis.askTestRuntime;
  }
});

test("card upload rejects anonymous callers and invalid image files", async () => {
  globalThis.askTestAuthenticated = false;
  const api = await loadModule("app/api/admin/ask/card/route.ts", {
    "@/app/lib/admin-auth": "export const isAdminRequest = async () => globalThis.askTestAuthenticated;",
    "@/app/lib/content-store": "export const saveAskShareImage = async () => true;",
  });
  assert.equal((await api.POST(new Request("https://test/api", { method: "POST" }))).status, 401);
  globalThis.askTestAuthenticated = true;
  const form = new FormData();
  form.set("id", "question");
  form.set("revision", "123");
  form.set("image", new Blob(["not a png"]), "card.png");
  assert.equal((await api.POST(new Request("https://test/api", { method: "POST", body: form }))).status, 400);
  delete globalThis.askTestAuthenticated;
});

test("tweet and copied text distinguish question and answer with a safe tweet budget", async () => {
  const { tweetQuestionAnswer, questionAnswerText } = await loadModule("app/ask/share-text.ts");
  assert.equal(questionAnswerText("Q?", "A."), "Question:\nQ?\n\nAnswer:\nA.");
  const text = tweetQuestionAnswer("q".repeat(1200), "a".repeat(4000));
  assert.match(text, /^Question: /);
  assert.match(text, /\n\nAnswer: /);
  assert.ok(Array.from(text).length + 24 <= 280);
});
