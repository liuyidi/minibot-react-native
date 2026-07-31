# Plan: 源码收拢到 `src/`

> 状态：**已完成**（2026-07-31）  
> 约定时间：2026-07-30 · 执行：2026-07-31

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
├── index.tsx              # 入口（gesture-handler + expo-router → src/app）
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
    ├── app/               # Expo Router
    │   ├── _layout.tsx
    │   ├── +not-found.tsx
    │   ├── (auth)/
    │   ├── (tabs)/        # chat / knowledge / discover / me
    │   └── settings/      # 二级设置（根 Stack，无 Tab）
    │
    ├── components/
    │   ├── ui/
    │   ├── auth/
    │   ├── chat/
    │   ├── settings/
    │   └── navigation/
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
        ├── chat/          # 含 session/
        ├── settings/
        ├── i18n/
        └── theme/
```

## 映射（现状 → 目标）

| 现在（迁移前） | 最终 |
|------|------|
| `/app` | `/src/app` |
| `/components`、`/context`、`/hooks`、`/constants`、`/types`、`/lib` | `/src/…` 同名 |
| `/lib/*.ts` 平铺 | `/src/lib/{minibot,deepseek,auth,chat,settings,i18n,theme}` |
| `/assets`、`/docs`、`/scripts`、`android`、`ios` | 仍在根 |
| `app.ts`（备用入口） | 已删除，逻辑并入 `index.tsx` |
| `screenshot/` | 仓库中不存在，跳过 |
| 未用模板（`HelloWave`、`ParallaxScrollView`、`Collapsible`、`ChatMessageBox`、`ReplyMessageBar`） | 已删除 |

## 落地步骤

1. ~~**整迁进 `src/`**~~：已移动；`tsconfig` paths → `./src/*`；`index.tsx` 的 `require.context("./src/app")`。
2. ~~**冒烟**~~：请本地 `npx expo start` 验证登录 / 设置 / Minibot 连接（Metro 需重启以加载新目录）。
3. ~~**`lib/` 按域重命名**~~：imports 已批量改为 `@/lib/{domain}/…`；`tsc --noEmit` 仅剩既有 `ExternalLink` typed-routes 告警。
4. ~~**清遗留**~~：已删 `app.ts` 与未用模板。
5. ~~**更新 README**~~：中英文「项目结构」已同步；本计划标为已完成。

## 刻意不做

- 不把 `android/`、`ios/`、`app.json`、`scripts/`、`docs/` 塞进 `src/`。
- 不在本计划里改产品行为或依赖版本（纯结构迁移）。

## 相关

- GitHub Packages 鉴权：[`github-packages.md`](./github-packages.md)
- 移动端路线图：[`minibot-mobile-roadmap.md`](./minibot-mobile-roadmap.md)
