import { build } from "esbuild";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const serverDir = path.join(root, "dist", "server");
const workerConfigPath = path.join(serverDir, "wrangler.json");

await mkdir(clientDir, { recursive: true });
await rm(path.join(clientDir, "_worker-runtime"), { recursive: true, force: true });

const workerConfig = JSON.parse(await readFile(workerConfigPath, "utf8"));
delete workerConfig.legacy_env;
await writeFile(workerConfigPath, `${JSON.stringify(workerConfig)}\n`);

await build({
  entryPoints: [path.join(serverDir, "index.js")],
  outfile: path.join(clientDir, "_worker.js"),
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  external: ["cloudflare:workers", "node:*"],
  legalComments: "none",
  logLevel: "silent",
});

const assetsIgnorePath = path.join(clientDir, ".assetsignore");
let assetsIgnore = "";
try {
  assetsIgnore = await readFile(assetsIgnorePath, "utf8");
} catch {
  assetsIgnore = "";
}

const ignoreEntries = [
  "wrangler.json",
  ".dev.vars",
  ".vite",
  "_worker-runtime",
];
const existingEntries = new Set(
  assetsIgnore
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean),
);

for (const entry of ignoreEntries) {
  existingEntries.add(entry);
}

await writeFile(assetsIgnorePath, `${[...existingEntries].join("\n")}\n`);
