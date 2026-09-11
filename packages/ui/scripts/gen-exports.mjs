#!/usr/bin/env node
/**
 * Generate module maps + slim package.json exports + tsup entries.
 *
 * package.json cannot import another JSON for `exports` — keep a small wildcard
 * map there. Per-module src paths live in scripts/short-path-map.json (Metro).
 *
 * Publish layout:
 *   lib/<name>/index.js  (CJS)  ← babel-plugin-import target
 *   es/<name>/index.js   (ESM)
 *
 * Usage:
 *   node scripts/gen-exports.mjs           # print map
 *   node scripts/gen-exports.mjs --write   # write package.json + maps
 *   node scripts/gen-exports.mjs --check   # validate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const componentsRoot = path.join(root, "src/components");
const indexPath = path.join(root, "src/index.ts");
const entriesPath = path.join(root, "scripts/entries.json");
const mapPath = path.join(root, "scripts/short-path-map.json");
const aliasPath = path.join(root, "scripts/babel-aliases.json");

/** Slim exports — Node/npm need this in package.json (no external $ref). */
const SLIM_EXPORTS = {
  ".": {
    "react-native": "./src/index.ts",
    import: "./es/index.js",
    require: "./lib/index.js",
    types: "./src/index.ts",
    default: "./lib/index.js",
  },
  "./lib/*": {
    "react-native": "./lib/*/index.js",
    import: "./es/*/index.js",
    require: "./lib/*/index.js",
    default: "./lib/*/index.js",
  },
  "./es/*": {
    import: "./es/*/index.js",
    default: "./es/*/index.js",
  },
  "./package.json": "./package.json",
};

function walkIndexes(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkIndexes(p, out);
    else if (name === "index.ts") out.push(p);
  }
  return out;
}

/** Same as babel-plugin-import `transCamel(..., '-')` */
function camel2Dash(name) {
  const cells = name.match(/([A-Z]+(?=[A-Z]|$))|([A-Z]?[^A-Z]+)/g) || [];
  return cells.map((c) => c.toLowerCase()).join("-");
}

/** @returns {Record<string, string>} short → src relative path (./src/...) */
function buildShortPathMap() {
  /** @type {Record<string, string>} */
  const map = {
    theme: "./src/theme/index.ts",
    config: "./src/config/index.ts",
    overlay: "./src/overlay/index.ts",
    date: "./src/date/index.ts",
  };
  for (const file of walkIndexes(componentsRoot)) {
    const rel = path.relative(path.join(root, "src"), file);
    const parts = rel.split(path.sep);
    const short = parts[parts.length - 2];
    const exportPath = "./src/" + parts.join("/");
    if (map[short] && map[short] !== exportPath) {
      console.error(
        `short-path conflict for "${short}":\n  ${map[short]}\n  ${exportPath}`,
      );
      process.exit(1);
    }
    map[short] = exportPath;
  }
  return map;
}

/**
 * Root barrel value exports → short folder.
 * @returns {Record<string, string>} symbol → short
 */
function buildSymbolToShort() {
  const src = fs.readFileSync(indexPath, "utf8");
  /** @type {Record<string, string>} */
  const map = {};
  const re = /export\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(/\s+as\s+/)[0].trim());
    const from = m[2];
    let short;
    if (from === "./theme") short = "theme";
    else if (from === "./config") short = "config";
    else if (from === "./overlay") short = "overlay";
    else if (from === "./date") short = "date";
    else {
      const parts = from.replace(/^\.\//, "").split("/");
      short = parts[parts.length - 1];
    }
    for (const name of names) {
      map[name] = short;
    }
  }
  return map;
}

/**
 * @returns {Record<string, { short: string, symbol: string }>}
 */
function buildBabelAliases(symbolToShort) {
  /** @type {Record<string, { short: string, symbol: string }>} */
  const aliases = {};
  for (const [symbol, short] of Object.entries(symbolToShort)) {
    const dash = camel2Dash(symbol);
    if (dash !== short) {
      aliases[dash] = { short, symbol };
    }
  }
  return aliases;
}

function buildTsupEntries(shortMap) {
  /** @type {Record<string, string>} */
  const entries = {
    index: "src/index.ts",
  };
  for (const [short, srcPath] of Object.entries(shortMap)) {
    entries[`${short}/index`] = srcPath.replace(/^\.\//, "");
  }
  return entries;
}

function slimExportsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const shortMap = buildShortPathMap();
const symbolToShort = buildSymbolToShort();
const babelAliases = buildBabelAliases(symbolToShort);
const entries = buildTsupEntries(shortMap);
const mode = process.argv.includes("--write")
  ? "write"
  : process.argv.includes("--check")
    ? "check"
    : "print";

if (mode === "print") {
  console.log(
    JSON.stringify(
      { shortMap, babelAliases, symbolToShort, entries, exports: SLIM_EXPORTS },
      null,
      2,
    ),
  );
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

if (mode === "write") {
  pkg.sideEffects = false;
  pkg.main = "lib/index.js";
  pkg.module = "es/index.js";
  pkg.types = "src/index.ts";
  pkg.files = ["lib", "es", "src", "package.json", "README.md"];
  pkg.exports = SLIM_EXPORTS;
  if (!pkg.scripts) pkg.scripts = {};
  pkg.scripts["exports:gen"] = "node scripts/gen-exports.mjs --write";
  pkg.scripts["exports:check"] = "node scripts/gen-exports.mjs --check";
  pkg.scripts.build = "tsup && node scripts/write-babel-aliases.mjs";
  pkg.scripts.prepublishOnly = "npm run build";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2) + "\n");
  fs.writeFileSync(mapPath, JSON.stringify(shortMap, null, 2) + "\n");
  fs.writeFileSync(aliasPath, JSON.stringify(babelAliases, null, 2) + "\n");
  console.log(
    `Wrote slim exports + maps (${Object.keys(shortMap).length} modules, ${Object.keys(babelAliases).length} babel aliases)`,
  );
  process.exit(0);
}

// --check
const missing = [];
if (!slimExportsEqual(pkg.exports, SLIM_EXPORTS)) {
  missing.push("package.json exports out of date (expected slim ./lib/* map)");
}
if (pkg.sideEffects !== false) missing.push("sideEffects should be false");
if (pkg.main !== "lib/index.js") missing.push('main should be "lib/index.js"');
if (!fs.existsSync(entriesPath) || !fs.existsSync(aliasPath) || !fs.existsSync(mapPath)) {
  missing.push("scripts/entries.json, short-path-map.json, or babel-aliases.json missing");
} else {
  const onDiskMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  for (const short of Object.keys(shortMap)) {
    if (onDiskMap[short] !== shortMap[short]) {
      missing.push(`short-path-map.json stale for ${short}`);
    }
  }
}
if (missing.length) {
  console.error(
    "exports:check failed:\n" + missing.map((m) => `  - ${m}`).join("\n"),
  );
  process.exit(1);
}
console.log("exports:check ok");
