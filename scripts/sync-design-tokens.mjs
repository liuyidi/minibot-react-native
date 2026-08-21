#!/usr/bin/env node
/**
 * Copy design tokens from sibling mini-design-system into this repo.
 *
 * Run from repo root:
 *   npm run sync:tokens
 *
 * Expects:
 *   ../mini-design-system/tokens/mini-brand.tokens.json
 *   ../mini-design-system/tokens/presets/*.tokens.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const designSystem = path.resolve(root, "../mini-design-system/tokens");
const outDir = path.resolve(root, "src/lib/theme/tokens/source");

const files = [
  ["mini-brand.tokens.json", "mini-brand.tokens.json"],
  ["presets/claude.tokens.json", "presets/claude.tokens.json"],
  ["presets/codex.tokens.json", "presets/codex.tokens.json"],
];

if (!fs.existsSync(designSystem)) {
  console.error(`Missing design-system tokens at ${designSystem}`);
  process.exit(1);
}

fs.mkdirSync(path.join(outDir, "presets"), { recursive: true });

for (const [fromRel, toRel] of files) {
  const from = path.join(designSystem, fromRel);
  const to = path.join(outDir, toRel);
  if (!fs.existsSync(from)) {
    console.error(`Missing ${from}`);
    process.exit(1);
  }
  fs.copyFileSync(from, to);
  console.log(`synced ${toRel}`);
}

fs.writeFileSync(
  path.join(outDir, "README.md"),
  [
    "# Token source copies",
    "",
    "Synced from sibling `mini-design-system/tokens` via `npm run sync:tokens`.",
    "Do not edit by hand — change design-system first, then re-sync.",
    "",
  ].join("\n"),
  "utf8"
);

console.log("done");
