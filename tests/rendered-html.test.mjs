import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("portfolio source includes public, admin, CV, and links surfaces", async () => {
  const [home, admin, cv, links, workflow] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cv/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/links/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
  ]);

  assert.match(home, /ContactForm/);
  assert.match(home, /getPortfolioContent/);
  assert.match(admin, /AdminDashboard/);
  assert.match(cv, /\/api\/cv\/file/);
  assert.match(links, /linkPage/);
  assert.match(workflow, /npm run build/);
});

test("default CV PDF is bundled for first deploy fallback", async () => {
  await access(new URL("../public/cv.pdf", import.meta.url));
});
