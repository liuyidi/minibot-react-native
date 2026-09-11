# `@minibot/ui` 按需引入 / 子路径导出方案

**Date:** 2026-09-11  
**Status:** Proposed  
**Context:** 多应用 / 分包场景下，业务不能因 `import { Button } from "@minibot/ui"` 拉进整包；RN（Metro）对 barrel 摇树不可靠，需以**子路径按需**为主、Web 摇树为辅。

---

## 1. 目标与非目标

### 目标

1. 业务可只引入用到的组件，例如 `import { Button } from "@minibot/ui/button"`。
2. 多 App / 分包时，未引用的 Dialog、SwipeCell、Toast 等不进入该 App 的 JS 依赖图。
3. 保留根入口 `@minibot/ui` 供 Storybook / 快速原型（但**业务默认禁用**）。
4. 发 npm 时具备 ESM + `sideEffects`，Web 侧可从根入口做有限摇树。
5. 短路径、稳定、可 lint 强制。

### 非目标（本方案不做）

- 不拆原生 peer（reanimated / gesture-handler）为独立 npm（可后续评估）。
- 不做运行时「插件式」动态加载组件。
- 不保证 Metro 对根 barrel 的完美 tree-shaking（靠子路径，不靠运气）。

---

## 2. 问题定性

| 现状 | 影响 |
|------|------|
| `main` → `src/index.ts` 大 barrel | 业务从根导入时，Metro 易整图解析 |
| `exports["./components/*/*"]` | 已可按需，但路径长、难记、难约束 |
| 无 `sideEffects`、无正式 `dist/` | 发 npm / Web 不友好 |
| 无 lint 规则 | 业务容易继续写根导入 |

**RN 结论：** 可靠按需 = **独立入口文件**，不是指望摇树。  
**Web 结论：** ESM + `sideEffects: false` + 命名导出，根入口才有摇树意义。

---

## 3. 推荐架构

```text
packages/ui/
  package.json          # exports 映射短路径 → 源码或 dist
  scripts/
    gen-exports.mjs     # 从组件目录生成 exports + 短路径表（可选）
  src/
    index.ts            # 总入口（Storybook / 兼容）
    theme/              # 共享：允许被任意组件入口依赖
    config/
    utils/
    components/.../index.ts
  dist/                 # Phase 2：ESM 多入口构建产物（发 npm 用）
```

### 3.1 短路径约定

组件名 → kebab-case 短路径（与文件夹名一致，去掉 category）：

| 短路径 | 实际模块 |
|--------|----------|
| `@minibot/ui/button` | `components/controls/button` |
| `@minibot/ui/switch` | `components/controls/switch` |
| `@minibot/ui/search-bar` | `components/forms/search-bar` |
| `@minibot/ui/bottom-sheet` | `components/overlays/bottom-sheet` |
| `@minibot/ui/theme` | `theme` |
| `@minibot/ui/config` | `config` |

**规则：**

- 一个组件目录 = 一个短路径（与现有 `*/index.ts` 一一对应）。
- 命名冲突时（无）保留目录名；若未来冲突，用 `@minibot/ui/overlays/popup` 二级路径。
- **禁止**再导出「半包」barrel（如 `@minibot/ui/controls` 导出全部 controls）。

### 3.2 业务 import 规范

```ts
// ✅ 推荐（RN / 多应用强制）
import { Button } from "@minibot/ui/button";
import { ThemeProvider, brandLight } from "@minibot/ui/theme";
import { ConfigProvider } from "@minibot/ui/config";

// ⚠️ 仅 Storybook / 内部 demo
import { Button, Dialog } from "@minibot/ui";

// ❌ 业务禁止
import { Button } from "@minibot/ui";
```

可选 DX：babel 插件把根导入改写成子路径（Phase 3）；第一阶段靠 ESLint 禁止根导入组件即可。

### 3.3 `package.json` 形态（目标）

```json
{
  "name": "@minibot/ui",
  "sideEffects": false,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./theme": "./src/theme/index.ts",
    "./config": "./src/config/index.ts",
    "./button": "./src/components/controls/button/index.ts",
    "./switch": "./src/components/controls/switch/index.ts",
    "./package.json": "./package.json"
  }
}
```

发 npm（Phase 2）改为：

```json
{
  "sideEffects": false,
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./button": {
      "types": "./dist/button.d.ts",
      "import": "./dist/button.js"
    }
  }
}
```

**构建原则：**

- 多 entry（每个短路径一个），**禁止**打成单文件 `ui.js`。
- 共享代码（theme / utils）作为被依赖模块，不复制进每个 entry。
- peerDependencies 保持现状；不打包 react / RN / reanimated。

### 3.4 重 peer 组件（可选拆包，Phase 后置）

| 组件 | 重依赖 | 建议 |
|------|--------|------|
| Slider | `@react-native-community/slider` | 短路径即可；App 未 import 则 peer 可不装（需文档说明） |
| SwipeCell | gesture-handler + reanimated | 同上；或未来 `@minibot/ui-swipe` |
| BottomSheet 等 | 视实现 | 保持单包 + 子路径，先观察包体 |

第一阶段**不拆 npm 包名**，只靠子路径切断 JS 图。

---

## 4. 分阶段落地

### Phase 0 — 约定与清单（0.5d）

- 列出全部短路径 ↔ 目录映射表（~50 个组件 + theme/config）。
- 文档：业务如何 import、禁止根 barrel。
- 决定：monorepo 内先走 **源码 exports**（与现状一致），发 npm 再上 dist。

### Phase 1 — 短路径 exports + lint（1–2d）【优先】

- 扩展 `packages/ui/package.json` `exports`（可用脚本从 `components/**/index.ts` 生成）。
- 保留旧路径 `./components/*/*` 一个大版本以免破坏。
- App / 新业务：ESLint `no-restricted-imports` 禁止从 `@minibot/ui` 导入组件符号（允许 `theme`/`config` 走子路径）。
- 迁移本仓：`MiniLoginScreen` 等改为 `@minibot/ui/button` 等。
- 验证：Metro 解析 `@minibot/ui/button`；用 bundle 可视化或简单「只 import Button 的测试入口」确认 Dialog 不进图。

### Phase 2 — 正式 ESM 多入口构建（2–3d，发 npm 前）

- tsup / unbuild：entries = 短路径表。
- `"sideEffects": false`。
- `files: ["dist", "package.json"]`；CI `npm pack` 检查。
- 版本策略：`0.x` 可 breaking；对旧长路径给 deprecation 注释。

### Phase 3 — DX（可选）

- `babel-plugin-import` 风格：根 `import { Button }` → `@minibot/ui/button`。
- 或 Metro `resolveRequest` 做同样映射（仅本 monorepo）。
- README + 设计系统文档写清约定。

---

## 5. 验证方式

1. **解析：** `npx expo customize` 无关；写临时 `scripts/check-resolve.mjs` 或 Jest resolver 测 exports。
2. **依赖图：** 建 `apps/smoke-button` 或 Story 外入口，仅 `import { Button } from "@minibot/ui/button"`，用 Metro serializer / `expo export` 产物 grep `Dialog`/`SwipeCell` 应不出现。
3. **类型：** `tsc` 对子路径 `exports` 的 `types` 条件能解析。
4. **回归：** Storybook 仍可用根 `@minibot/ui`；App 登录页 Button 正常。

---

## 6. 风险与取舍

| 风险 | 缓解 |
|------|------|
| 短路径手写易漏 | `gen-exports.mjs` + CI 校验「目录有 index 则必须在 exports」 |
| 业务继续用根入口 | ESLint 错误级 + Code Review |
| Metro 缓存旧解析 | 改 exports 后清 Metro cache |
| 组件间互相 import 整包 | 组件只依赖 theme/utils/同级明确组件；禁止 `from "../../index"` |
| 误设 `sideEffects: false` 弄坏 CSS/polyfill | UI 包无全局 CSS；若有顶层 `LogBox`/注册，列入 `sideEffects` 白名单 |

---

## 7. 决策摘要（请确认）

1. **主路径：** 短路径 `@minibot/ui/<name>` 为业务唯一推荐方式。  
2. **根入口：** 保留，仅 Storybook / 内部；业务 lint 禁止。  
3. **Phase 1 先做源码 exports**（monorepo 立刻受益）；**Phase 2 再 dist + 发 npm**。  
4. **暂不拆** `@minibot/ui-gesture` 等子包。  
5. **旧** `./components/*/*` **保留至下一主版本再删**。

确认后按 `docs/superpowers/plans/2026-09-11-minibot-ui-subpath-exports.md` 实施。
