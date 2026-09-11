# scripts

```bash
node scripts/gen-exports.mjs           # print maps / slim exports
node scripts/gen-exports.mjs --write   # write package.json (slim exports) + maps
node scripts/gen-exports.mjs --check   # CI: fail if out of date
node scripts/write-babel-aliases.mjs   # after tsup: RadioGroup→radio-group stubs, etc.
```

Generated maps (not inlined into package.json):

- `short-path-map.json` — module name → `src/...`（Metro 用）
- `babel-aliases.json` — babel camel2Dash 别名 → `{ short, symbol }`
- `entries.json` — tsup entries

`package.json` `exports` 只保留通配（`./lib/*`）；Node 不支持把 exports 外置到别的文件再 import。

`npm run build` = `tsup && write-babel-aliases`。
