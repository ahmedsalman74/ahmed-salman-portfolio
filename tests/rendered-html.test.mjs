import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("portfolio source includes public, admin, CV, links, and ask surfaces", async () => {
  const [
    home,
    admin,
    cv,
    links,
    ask,
    publicAskApi,
    adminAskApi,
    schema,
    seo,
    robots,
    sitemap,
    textSitemap,
    workflow,
    runtime,
    cvFileApi,
    adminCvApi,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cv/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/links/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ask/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/ask/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/ask/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/seo.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.txt", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/runtime.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/cv/file/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/cv/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(home, /ContactForm/);
  assert.match(home, /getPortfolioContent/);
  assert.match(admin, /AdminDashboard/);
  assert.match(cv, /\/api\/cv\/file/);
  assert.match(links, /linkPage/);
  assert.match(links, /application\/ld\+json/);
  assert.doesNotMatch(links, /linksSearchPanel/);
  assert.match(ask, /AskForm/);
  assert.match(ask, /QAPage/);
  assert.match(publicAskApi, /createAskQuestion/);
  assert.match(adminAskApi, /updateAskQuestion/);
  assert.match(schema, /askQuestions/);
  assert.match(schema, /idx_ask_questions_show_on_profile/);
  assert.match(seo, /Salman Twitch/);
  assert.match(seo, /احمد سالمان/);
  assert.match(robots, /\/sitemap\.xml/);
  assert.match(robots, /\/sitemap\.txt/);
  assert.match(robots, /\/ask/);
  assert.match(robots, /\/admin/);
  assert.match(sitemap, /\/links/);
  assert.match(sitemap, /\/ask/);
  assert.match(sitemap, /2026-09-04/);
  assert.match(textSitemap, /https:\/\/ahmedsalman\.pages\.dev\/links/);
  assert.match(textSitemap, /https:\/\/ahmedsalman\.pages\.dev\/ask/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /deploy:cloudflare:dry-run/);
  assert.match(workflow, /CLOUDFLARE_DEPLOY_HOOK/);
  assert.match(workflow, /npm run deploy:cloudflare/);
  assert.match(runtime, /CV_STORE/);
  assert.match(cvFileApi, /getWithMetadata/);
  assert.match(adminCvApi, /store\.put/);
});

test("Cloudflare Pages worker serves generated assets before dynamic routes", async () => {
  const prepareScript = await readFile(
    new URL("../scripts/prepare-cloudflare-pages.mjs", import.meta.url),
    "utf8",
  );

  assert.match(prepareScript, /env\.ASSETS\.fetch\(request\)/);
  assert.match(prepareScript, /assetResponse\.status !== 404/);
  assert.match(prepareScript, /app\.fetch\(request, env, context\)/);
  assert.match(prepareScript, /CF_PAGES_COMMIT_SHA/);
  assert.match(prepareScript, /_deployments/);
});

test("build prepares a Cloudflare Pages advanced-mode worker", async () => {
  const [packageJson, prepareScript] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/prepare-cloudflare-pages.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(packageJson, /prepare-cloudflare-pages\.mjs/);
  assert.match(packageJson, /wrangler pages deploy dist\/client --project-name=ahmedsalman/);
  assert.match(prepareScript, /from "esbuild"/);
  assert.match(prepareScript, /bundle: true/);
  assert.match(prepareScript, /delete workerConfig\.legacy_env/);
  assert.match(prepareScript, /_worker\.js/);
});

test("default CV PDF is bundled for first deploy fallback", async () => {
  await access(new URL("../public/cv.pdf", import.meta.url));
});
