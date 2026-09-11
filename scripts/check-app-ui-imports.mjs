#!/usr/bin/env node
/**
 * Prefer `import { X } from "@minibot/ui"` (+ babel-plugin-import).
 * Fail if app `src/**` uses short-path / lib-path imports.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");
const re = /from\s+["']@minibot\/ui\/[^"']+["']/;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p);
  }
  return out;
}

const offenders = [];
for (const file of walk(srcRoot)) {
  const text = fs.readFileSync(file, "utf8");
  if (re.test(text)) {
    offenders.push(path.relative(root, file));
  }
}

if (offenders.length) {
  console.error(
    'App code should import from "@minibot/ui" (with babel-plugin-import), not subpaths:\n' +
      offenders.map((f) => `  - ${f}`).join("\n"),
  );
  process.exit(1);
}
console.log("check-app-ui-imports ok");
