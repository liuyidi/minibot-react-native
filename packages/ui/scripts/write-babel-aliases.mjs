#!/usr/bin/env node
/**
 * After tsup, create lib/<camel2Dash>/ stubs for babel-plugin-import.
 * When export name ≠ folder name (RadioGroup, ThemeProvider, Alert, …),
 * each stub re-exports that symbol as **default**.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const aliasPath = path.join(root, "scripts/babel-aliases.json");

if (!fs.existsSync(aliasPath)) {
  console.error("Missing scripts/babel-aliases.json — run npm run exports:gen");
  process.exit(1);
}

/** @type {Record<string, string | { short: string, symbol: string }>} */
const aliases = JSON.parse(fs.readFileSync(aliasPath, "utf8"));
let n = 0;
for (const [alias, meta] of Object.entries(aliases)) {
  const short = typeof meta === "string" ? meta : meta.short;
  const symbol = typeof meta === "string" ? null : meta.symbol;
  if (!symbol) {
    console.error(`babel alias "${alias}" missing symbol — re-run exports:gen`);
    process.exit(1);
  }
  const cjs = `const m = require("../${short}");
module.exports = m.${symbol};
module.exports.${symbol} = m.${symbol};
Object.keys(m).forEach((k) => {
  if (k !== "${symbol}" && k !== "__esModule" && k !== "default") {
    module.exports[k] = m[k];
  }
});
`;
  const esm = `export { ${symbol} as default, ${symbol} } from "../${short}/index.js";
`;
  for (const [dir, body] of [
    [path.join(root, "lib", alias), cjs],
    [path.join(root, "es", alias), esm],
  ]) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.js"), body);
  }
  n += 1;
}
console.log(`Wrote ${n} babel alias stubs under lib/ and es/ (default = symbol)`);
