# Plan: 源码收拢到 `src/`（待执行）

> 状态：**未执行** — 只作目录契约，晚点按此迁移。  
> 约定时间：2026-07-30

## 目标

- 业务源码全部进 `src/`，根目录只留 Expo/原生/配置/文档/脚本。
- `@/*` 别名指向 `./src/*`，业务 import 心智不变。
- `lib/` 按域收拢，少平铺；清掉遗留入口与模板噪音。

## 最终目录结构

```text
minibot-react-native/
├── app.json
├── package.json
├── package-lock.json
├── tsconfig.json          # "@/*" → "./src/*"
├── metro.config.js
├── eas.json
├── index.tsx              # 入口（gesture-handler + expo-router）；去掉与 app/ 撞名的 app.ts
├── .npmrc
├── .env.example
├── .gitignore
├── README.md
├── README.en.md
│
├── android/               # 原生工程（不动）
├── ios/
├── assets/                # 图片/字体/静态数据（留根）
│   ├── images/
│   ├── fonts/
│   └── data/
│
├── scripts/               # 构建 / GitHub Packages 安装等
├── docs/                  # 文档（含本计划）
│
└── src/                   # ★ 全部应用源码
    ├── app/               # Expo Router（现根目录 app/ 挪入）
    │   ├── _layout.tsx
    │   ├── +not-found.tsx
    │   ├── (auth)/
    │   └── (tabs)/
    │       ├── index.tsx
    │       ├── discover.tsx
    │       ├── knowledge.tsx
    │       └── settings/
    │
    ├── components/
    │   ├── ui/
    │   ├── auth/
    │   ├── chat/
    │   └── settings/
    │
    ├── context/
    ├── hooks/
    ├── constants/
    ├── types/
    │
    └── lib/               # 按域收拢
        ├── minibot/
        ├── deepseek/      # 过渡期
        ├── auth/
        ├── chat/
        ├── settings/
        ├── i18n/
        └── theme/
```

## 映射（现状 → 目标）

| 现在 | 最终 |
|------|------|
| `/app` | `/src/app` |
| `/components`、`/context`、`/hooks`、`/constants`、`/types`、`/lib` | `/src/…` 同名 |
| `/lib/*.ts` 平铺 | `/src/lib/{minibot,deepseek,auth,chat,settings,…}` |
| `/assets`、`/docs`、`/scripts`、`android`、`ios` | 仍在根 |
| `app.ts`（备用入口） | 删除或并入 `index.tsx` |
| `screenshot/` | `docs/screenshots/` 或移出日常路径 |
| 未用模板组件（如 `HelloWave`） | 删除 |

## 落地步骤（执行时按序）

1. **整迁进 `src/`**：移动 `app` / `components` / `context` / `hooks` / `constants` / `types` / `lib`；改 `tsconfig` paths、`metro`（若需要）、入口对 `app` 的 context 路径。
2. **冒烟**：`npx expo start`，登录 / 设置 / Minibot server 连接仍可用。
3. **`lib/` 按域重命名**：调整 import；跑一遍 TypeScript / 关键路径。
4. **清遗留**：删 `app.ts`、无用模板、整理 `screenshot`。
5. **更新 README** 项目结构一节与本计划状态为「已完成」。

## 刻意不做

- 不把 `android/`、`ios/`、`app.json`、`scripts/`、`docs/` 塞进 `src/`。
- 不在本计划里改产品行为或依赖版本（纯结构迁移）。

## 相关

- GitHub Packages 鉴权：[`github-packages.md`](./github-packages.md)
- 移动端路线图：[`minibot-mobile-roadmap.md`](./minibot-mobile-roadmap.md)
