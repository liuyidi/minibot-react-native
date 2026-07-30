# GitHub Packages 鉴权（`@liuyidi/minibot-client`）

本仓库通过 npm alias 使用：

```json
"@minibot/client": "npm:@liuyidi/minibot-client@0.1.0"
```

发布 registry 是 **GitHub Packages**（私有），安装需要 `NODE_AUTH_TOKEN`。

## 一次配置（建议）

```bash
cp .env.example .env
# 编辑 .env → NODE_AUTH_TOKEN=ghp_xxx
npm run install:deps
```

- `.npmrc`（已入库）：把 `@liuyidi` 指到 `https://npm.pkg.github.com`，token 读环境变量  
- `.env`（**不入库**）：放真实 PAT  
- `.env.example`（已入库）：提醒字段，避免下次忘记

PAT：https://github.com/settings/tokens — classic 勾选 `read:packages`。

## 临时方式

```bash
export NODE_AUTH_TOKEN=ghp_xxx
npm install
```

## EAS / CI

在构建环境注入 Secret `NODE_AUTH_TOKEN`（不要写进仓库）。Expo EAS：Project → Secrets。
