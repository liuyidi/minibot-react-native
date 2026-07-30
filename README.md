# Minibot React Native

[English](./README.en.md) | 简体中文

基于 **Expo + React Native** 的 **Minibot 移动端客户端**。目标是对接 [minibot](https://github.com/liuyidi/minibot) 的 FastAPI server 层（默认 `:8766`），把桌面端 [webui](https://github.com/liuyidi/minibot/tree/main/webui) 的能力带到 iOS / Android / Web。

> **现状说明**：应用壳（导航、聊天 UI、设置栈、主题）已可用；**Phase 1 连接层已接入** `@minibot/client`（bootstrap + WS + sessions 探测）。聊天主路径仍可走 DeepSeek 直连作为过渡；长期路径是 minibot WS 流式，详见 [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md)。

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
- **主题与偏好**：明暗模式、语言、模型 / thinking 等本地偏好
- **账号（过渡）**：可选登录 / 访客；DeepSeek API Key 存于 Secure Store
- **路线图**：对接 minibot 会话、WS 流式与设置面 —— 见 [docs/TODO.md](./docs/TODO.md)

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Expo SDK 54、React Native 0.81 |
| 路由 | Expo Router 6 |
| 聊天 UI | react-native-gifted-chat |
| 网络 | `@minibot/client`（bootstrap / REST / WS）+ axios（过渡期 DeepSeek） |
| 密钥存储 | expo-secure-store |
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

### 3. 过渡期：配置 DeepSeek（当前聊天主路径）

在 minibot 连接层完成前，可继续用 DeepSeek：

1. 在 [DeepSeek 开放平台](https://platform.deepseek.com/) 创建 API Key  
2. App 内 **设置 → API Key** 保存（仅本机 Secure Store）  
3. 打开 **Chat** 开始对话  

### 4. 连接 minibot

1. 默认连生产：`https://bot.liuyidi.me`  
2. 本地调试：本机起 minibot，在设置里改 Base URL（模拟器 `127.0.0.1` / Android `10.0.2.2`）  
3. 客户端经 `@minibot/client`：bootstrap + REST + WebSocket  

## 项目结构

```
app/
├── _layout.tsx              # 根布局与 Providers
├── (auth)/                  # 登录 / 注册
└── (tabs)/
    ├── index.tsx            # 首页
    ├── explore.tsx          # Chat
    └── settings/            # 嵌套设置栈
components/                  # 聊天、设置、UI
context/                     # Auth / Appearance / Language / ChatPreferences
lib/                         # API、存储、主题相关
docs/
├── minibot-mobile-roadmap.md  # 主路线图
└── TODO.md                    # 待办索引
```

## 文档

| 文档 | 说明 |
|------|------|
| [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md) | 与 minibot / webui 的差距与分阶段计划 |
| [docs/TODO.md](./docs/TODO.md) | 待办总览 |
| [docs/chat-session-storage.md](./docs/chat-session-storage.md) | 本地 Session 草稿（参考） |
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
- **DeepSeek 402**：多为 Key 无效或余额不足。  
- **minibot 联调**：优先看路线图 Phase 1；勿与 DeepSeek 直连 Key 两套策略长期并存。

## 相关链接

- [minibot](https://github.com/liuyidi/minibot) — server + webui  
- [Expo](https://docs.expo.dev/) · [React Native](https://reactnative.dev/)  
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)

## 致谢

早期壳基于 [hellochirag/deepseek-react-native](https://github.com/hellochirag/deepseek-react-native) 二次开发；产品方向已转向 Minibot 移动端。

## License

MIT
