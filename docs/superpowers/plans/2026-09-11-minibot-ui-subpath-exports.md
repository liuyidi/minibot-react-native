# `@minibot/ui` 子路径按需导出 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让业务通过 `@minibot/ui/button` 等短路径按需引入组件，避免根 barrel 拉进整包；并为后续发 npm 的 ESM 多入口打好基础。

**Architecture:** 每个组件目录一个 `exports` 短路径；共享仅 `theme` / `config` / `utils`。RN 靠子路径切断依赖图，不依赖 Metro tree-shaking。根 `@minibot/ui` 保留给 Storybook，业务用 ESLint 禁止。

**Tech Stack:** Expo/Metro, TypeScript, `packages/ui/package.json` exports, 可选 tsup（Phase 2）, ESLint `no-restricted-imports`.

**Spec:** `docs/superpowers/specs/2026-09-11-minibot-ui-subpath-exports-design.md`

## Global Constraints

- 组件文件禁止 `from "../../index"` 或 `from "@minibot/ui"`（根）互相引用。
- 短路径 = 目录最后一段 kebab-case（`search-bar`, `bottom-sheet`）。
- 保留 `./components/*/*` 至少一个版本。
- Phase 1 不强制 dist；monorepo 继续源码直引。
- Commits: `feat(ui)`, `chore(ui)`, `docs(ui)`.

## File map

```text
packages/ui/
  package.json                          # sideEffects + exports 短路径
  scripts/gen-exports.mjs               # 生成 exports 片段 / 校验
  scripts/short-path-map.json           # 可选：生成物或源
  src/index.ts                          # 不变（Storybook）
  README.md                             # 业务 import 约定
docs/superpowers/specs/2026-09-11-minibot-ui-subpath-exports-design.md
.eslintrc / eslint.config.*             # no-restricted-imports（app）
src/components/auth/MiniLoginScreen.tsx # 改子路径
src/app/_layout.tsx                     # ConfigProvider → @minibot/ui/config
```

---

### Task 1: 短路径映射表 + gen-exports 脚本

**Files:**
- Create: `packages/ui/scripts/gen-exports.mjs`
- Create: `packages/ui/scripts/README.md`（3 行用法即可）
- Modify: `packages/ui/package.json`（加 script `exports:gen` / `exports:check`）

**Produces:**
- 扫描 `src/components/**/index.ts` → `{ "button": "./src/components/controls/button/index.ts", ... }`
- 另加 `./theme`、`./config`
- `exports:check`：目录有 index 但 package.json exports 缺失则 exit 1

- [ ] **Step 1: 实现扫描逻辑**

```js
// packages/ui/scripts/gen-exports.mjs（核心思路）
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const componentsRoot = path.join(root, "src/components");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (name === "index.ts") out.push(p);
  }
  return out;
}

const indexes = walk(componentsRoot);
const map = {};
for (const file of indexes) {
  const rel = path.relative(path.join(root, "src"), file); // components/controls/button/index.ts
  const parts = rel.split(path.sep);
  const short = parts[parts.length - 2]; // button
  if (map[short]) {
    console.error(`short-path conflict: ${short}`, map[short], rel);
    process.exit(1);
  }
  map[short] = "./src/" + rel.split(path.sep).join("/");
}
```

- [ ] **Step 2: 打印或写入 `exports` 建议 JSON；`check` 模式对比 `package.json`**

- [ ] **Step 3: 跑一遍，确认无 short-path 冲突**

```bash
cd packages/ui && node scripts/gen-exports.mjs --check
```

- [ ] **Step 4: Commit** `chore(ui): add exports gen/check script`

---

### Task 2: 写入 package.json exports + sideEffects

**Files:**
- Modify: `packages/ui/package.json`

**Produces:**
- `"sideEffects": false`
- `exports` 含：`.`, `./theme`, `./config`, 每个短路径, 以及兼容 `./components/*/*`

- [ ] **Step 1: 用 gen 脚本输出合并进 package.json**

示例片段：

```json
{
  "sideEffects": false,
  "exports": {
    ".": "./src/index.ts",
    "./theme": "./src/theme/index.ts",
    "./config": "./src/config/index.ts",
    "./button": "./src/components/controls/button/index.ts",
    "./search-bar": "./src/components/forms/search-bar/index.ts",
    "./components/*/*": "./src/components/*/*/index.ts",
    "./package.json": "./package.json"
  }
}
```

- [ ] **Step 2: `exports:check` 通过**

- [ ] **Step 3: 本地 Metro 解析冒烟**

在 app 临时文件或 node：

```ts
import { Button } from "@minibot/ui/button";
import { brandLight } from "@minibot/ui/theme";
```

启动 `npx expo start` 或已有 Storybook，确认无 “Unable to resolve”。

- [ ] **Step 4: Commit** `feat(ui): add short-path package exports`

---

### Task 3: 禁止组件内引用根 barrel

**Files:**
- Grep + fix: `packages/ui/src/**/*.{ts,tsx}`

- [ ] **Step 1: 搜索违规**

```bash
rg "from [\"']@minibot/ui[\"']|from [\"']\\.\\./\\.\\./\\.\\./index|from [\"']\\.\\./\\.\\./index[\"']" packages/ui/src
```

- [ ] **Step 2: 改为相对路径到具体模块（theme / sibling component）**

- [ ] **Step 3: Commit** `refactor(ui): avoid root barrel imports inside kit`

---

### Task 4: 本仓业务改为短路径 + ESLint

**Files:**
- Modify: `src/app/_layout.tsx`
- Modify: `src/components/auth/MiniLoginScreen.tsx`
- Modify: `src/lib/theme/toUiTheme.ts`（type-only 可继续 `@minibot/ui` 或改 `@minibot/ui/theme`）
- Modify: ESLint 配置（项目现用哪个就改哪个）

**ESLint 示例：**

```js
{
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@minibot/ui",
            message:
              "Import from @minibot/ui/<component> (e.g. @minibot/ui/button). Root barrel is Storybook-only.",
          },
        ],
      },
    ],
  },
}
```

Storybook / `.rnstorybook/**` 用 overrides 关闭该规则。

- [ ] **Step 1: 改业务 import**

```ts
import { Button, TextField } from "@minibot/ui/button"; // WRONG if TextField not in button
// 正确：
import { Button } from "@minibot/ui/button";
import { TextField } from "@minibot/ui/text-field";
import { ThemeProvider, brandLight } from "@minibot/ui/theme";
import { ConfigProvider } from "@minibot/ui/config";
```

- [ ] **Step 2: ESLint 对 `src/**` 生效；`.rnstorybook/**` 豁免**

- [ ] **Step 3: App / Storybook 冒烟**

- [ ] **Step 4: Commit** `refactor(app): use @minibot/ui short-path imports`

---

### Task 5: 文档

**Files:**
- Create or Modify: `packages/ui/README.md`
- Spec 已存在：链到 README

- [ ] **Step 1: README 写清**

```md
## Imports

Prefer short paths (required for app code):

import { Button } from "@minibot/ui/button";

Root `@minibot/ui` is for Storybook only.
```

- [ ] **Step 2: Commit** `docs(ui): document short-path imports`

---

### Task 6（可选 / 发 npm 前）: tsup 多入口 dist

**Files:**
- Create: `packages/ui/tsup.config.ts`
- Modify: `packages/ui/package.json` scripts `build`, exports → `dist/*`

- [ ] **Step 1: tsup entries = gen-exports 的 map**

```ts
// 伪代码：entry: { index: "src/index.ts", button: "src/components/controls/button/index.ts", ... }
```

- [ ] **Step 2: `format: ["esm"]`, `dts: true`, external: peers + react-native\***

- [ ] **Step 3: `npm pack --dry-run` 检查只含 dist**

- [ ] **Step 4: Commit** `feat(ui): add multi-entry ESM build`

---

### Task 7（可选）: 按需依赖图冒烟

**Files:**
- Create: `packages/ui/scripts/smoke-button-entry.tsx`（或 app 临时路由）

- [ ] **Step 1: 仅 import Button + ThemeProvider**

- [ ] **Step 2: `npx expo export` 或 Metro bundle，grep 产物**

```bash
# 产物中不应出现 SwipeCell / BottomSheet 等字符串（按实际导出符号调整）
rg "SwipeCell|BottomSheet|ActionSheet" <bundle> && exit 1 || true
```

- [ ] **Step 3: 记录结果到 README 或 CI note**

---

## Done when

- [ ] `@minibot/ui/button` 等短路径可解析
- [ ] `exports:check` 在 CI 或本地可跑
- [ ] 业务 `src/**` 不再从根 `@minibot/ui` 导入组件
- [ ] Storybook 仍可用根入口
- [ ] Spec §7 决策已落实（短路径为主、暂不拆子包）

## Out of scope（本 plan 不写代码）

- babel-plugin 自动改写根导入（Phase 3）
- 拆 `@minibot/ui-swipe` 独立包
- 删除 `./components/*/*` 兼容路径
