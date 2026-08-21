# Minibot React Native

[English](./README.en.md) | 简体中文

基于 **Expo + React Native** 的 **Minibot 移动端客户端**。目标是对接 [minibot](https://github.com/liuyidi/minibot) 的 FastAPI server 层（默认 `:8766`），把桌面端 [webui](https://github.com/liuyidi/minibot/tree/main/webui) 的能力带到 iOS / Android / Web。

> **现状说明**：应用壳（导航、聊天 UI、设置栈、主题）已可用；**Phase 1 连接层已接入** `@minibot/client`（bootstrap + REST + WS）。聊天仅走 minibot WS 流式（已移除 DeepSeek 直连），详见 [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md)。

## 产品定位

| | 说明 |
|--|------|
| **服务端** | sibling 仓库 minibot（FastAPI），而非自建聊天后端 |
| **桌面参考** | minibot `webui`（会话、流式、设置、agent 协议） |
| **本仓库** | 原生移动端实现同一套产品体验 |

```text
┌─────────────────────┐     bootstrap / REST / WS      ┌──────────────────┐
│  minibot-react-native│ ─────────────────────────────► │  minibot :8766   │
│  (Expo / RN)         │ ◄───────────────────────────── │  agent + sessions │
└─────────────────────┘                                 └──────────────────┘
         ▲  UX / 协议参考
         │
┌─────────────────────┐
│  minibot/webui       │
│  (Vite React SPA)    │
└─────────────────────┘
```

## 当前功能

- **跨平台**：iOS / Android / Web（Expo Go 或开发构建）
- **三栏导航**：首页引导、Chat、设置（嵌套 Settings stack）
- **聊天 UI**：`react-native-gifted-chat`，流式回复、reasoning 气泡、Markdown
- **主题与偏好**：外观主题包、明暗模式、语言
- **账号**：mini-auth 邮箱验证码 / Demo / OAuth；Gateway Bearer
- **路线图**：会话体验与设置面对齐 webui —— 见 [docs/TODO.md](./docs/TODO.md)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Expo SDK 54、React Native 0.81 |
| 路由 | Expo Router 6 |
| 聊天 UI | react-native-gifted-chat |
| 网络 | `@minibot/client`（bootstrap / REST / WS） |
| 安全存储 | expo-secure-store（auth token） |
| 语言 | TypeScript |

目标协议（实施中）：minibot `GET /webui/bootstrap`、Bearer REST、`/ws?token=`。

## 环境要求

- **Node.js**：建议 `>= 20.19.4`（见 `.nvmrc`，可用 `nvm use`）
- **包管理器**：npm
- **移动端调试**：[Expo Go](https://expo.dev/go)（需与 SDK 54 匹配）
- **（目标）后端**：本地或已部署的 [minibot](https://github.com/liuyidi/minibot) server

## 快速开始

### 1. 克隆并安装

`@minibot/client` 来自 GitHub Packages（发布名 `@liuyidi/minibot-client`）：

```bash
git clone git@github.com:liuyidi/minibot-react-native.git
cd minibot-react-native

npm run setup:github-packages   # 生成 .env（填 NODE_AUTH_TOKEN）
# 编辑 .env → NODE_AUTH_TOKEN=ghp_xxx（read:packages）
npm run install:deps
```

鉴权说明见 [`docs/github-packages.md`](./docs/github-packages.md)。`.npmrc` / `.env.example` 已入库；真实 token 只放 `.env`（不提交）。

默认 Gateway：`https://bot.liuyidi.me`（`app.json` → `extra.minibotBaseUrl`）。本地调试可在「我的 → Minibot 服务器」改成 `http://127.0.0.1:8766`。

### 2. 启动开发服务器

```bash
npx expo start
```

- `i` — iOS 模拟器  
- `a` — Android 模拟器  
- `w` — Web  
- 扫码 — Expo Go 真机  

```bash
npm run ios
npm run android
npm run web
```

### 3. 连接 minibot 并聊天

1. 登录（邮箱验证码 / Demo / OAuth）后默认连生产 Gateway：`https://bot.liuyidi.me`  
2. 本地调试：本机起 minibot，在「关于」双击底部版本号进入服务器设置，改 Base URL（模拟器 `127.0.0.1` / Android `10.0.2.2`）  
3. Chat Tab 仅在 gateway 已连接时可发消息（WS `attach` / delta / abort）  

## 项目结构

```
index.tsx                    # 入口（gesture-handler + Expo Router → src/app）
src/
├── app/                     # Expo Router
│   ├── _layout.tsx          # 根布局与 Providers
│   ├── (auth)/              # 登录 / 注册
│   ├── (tabs)/
│   │   ├── index.tsx        # Chat
│   │   ├── knowledge.tsx
│   │   ├── discover.tsx
│   │   └── me.tsx           # 我的（Tab 首页）
│   └── settings/            # 二级设置页（根 Stack，无 Tab）
├── components/              # 聊天、设置、UI、navigation
├── context/                 # Auth / Appearance / Language / Minibot
├── hooks/
├── constants/
├── types/
└── lib/                     # 按域：minibot / auth / chat / settings / i18n / theme
docs/
├── minibot-mobile-roadmap.md
├── src-layout-plan.md       # 源码目录契约（已完成）
└── TODO.md
assets/                      # 图片 / 字体（留根目录）
```

## 文档

| 文档 | 说明 |
|------|------|
| [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md) | 与 minibot / webui 的差距与分阶段计划 |
| [docs/src-layout-plan.md](./docs/src-layout-plan.md) | 源码收拢到 `src/`（已完成） |
| [docs/expo-go-ios-wss-debugging.md](./docs/expo-go-ios-wss-debugging.md) | Expo Go iOS WSS 失败排查（SocketRocket vs WebKit） |
| [docs/TODO.md](./docs/TODO.md) | 待办总览 |
| [docs/app-release-china.md](./docs/app-release-china.md) | 国内上架（后期） |

## 常用脚本

| 命令 | 说明 |
|------|------|
| `npm start` | Expo 开发服务器 |
| `npm run ios` / `android` / `web` | 各平台 |
| `npm run lint` | 代码检查 |
| `npm test` | 测试 |
| `npm run build:android:apk` | 打 Android APK |

## 注意事项

- **Expo Go**：须为 SDK 54。  
- **iOS 输入**：GiftedChat 需 `maxInputLength`，项目内已处理。  
- **minibot 联调**：优先看路线图 Phase 1；聊天依赖 gateway 连接（无本地直连模型 fallback）。

## 相关链接

- [minibot](https://github.com/liuyidi/minibot) — server + webui  
- [Expo](https://docs.expo.dev/) · [React Native](https://reactnative.dev/)  
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)

## 致谢

早期工程壳曾 fork 自开源聊天 demo；当前产品为 Minibot 移动端客户端。

## License

MIT
