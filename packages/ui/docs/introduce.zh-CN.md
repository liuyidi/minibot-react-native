---
order: 0
title: @minibot/ui 介绍
---

`@minibot/ui` 是 Minibot 移动端的 React Native 组件库，面向 Expo / React Native 多应用场景。设计 Token 以 [mini-design-system](https://github.com/liuyidi/mini-design-system) 为单一来源。

## 特性和优势

- 主题可配置：单一 `ConfigProvider`（theme / locale / Toast·Dialog 宿主）
- 基于 React Native / Expo，覆盖基础展示、表单、列表、反馈与浮层等常见场景
- 提供「组件按需加载」：根包引入 + `babel-plugin-import` 改写到 `lib/<name>`
- 使用 TypeScript 开发，提供类型定义，支持属性智能提示
- 重型能力（手势、动画、Slider 等）走 peerDependencies，未引用则不进依赖图

## 适用场景

- 适合多 App / 分包：只打包用到的组件
- 适合基于 Expo / React Native 的业务壳与内部工具
- 适合需要统一视觉、又要按页面裁剪体积的产品

## 版本

本仓库内通过本地包引用（`file:./packages/ui`）。发 npm 前请先执行 `npm run build` 生成 `lib/` / `es/`。

## 安装

在 monorepo 应用中已配置：

```json
{
  "dependencies": {
    "@minibot/ui": "file:./packages/ui"
  }
}
```

独立工程可改为 npm / GitHub Packages 版本后：

```bash
npm install @minibot/ui
```

### 安装 peerDependencies

以下依赖通过 `peerDependencies` 管理，便于各 App 对齐 Expo 推荐版本、避免重复安装：

| peer | 用途 |
|------|------|
| `react` / `react-native` | 基础运行时 |
| `react-native-safe-area-context` | SafeArea / 浮层 |
| `react-native-svg` + `lucide-react-native` | Icon |
| `react-native-gesture-handler` + `react-native-reanimated` | SwipeCell 等手势组件 |
| `@react-native-community/slider` | Slider |

使用 Expo 时推荐：

```bash
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets react-native-safe-area-context react-native-svg @react-native-community/slider
npm install lucide-react-native
```

仅 import 到对应组件时才需要装齐相关 peer；例如只用 `Button` / `Text` 时不必强装 gesture-handler。

## 示例

```jsx
import React from "react";
import { Button, ConfigProvider, brandLight } from "@minibot/ui";

export function Hello() {
  return (
    <ConfigProvider theme={brandLight}>
      <Button onPress={() => {}}>Start</Button>
    </ConfigProvider>
  );
}
```

App 入口只需包一层 `ConfigProvider`（主题、文案，以及 `RootSiblingParent` / OverlayStack 宿主）：

```jsx
import { ConfigProvider, brandLight } from "@minibot/ui";

export function AppProviders({ children }) {
  return (
    <ConfigProvider theme={brandLight} locale="zh" mode="light">
      {children}
    </ConfigProvider>
  );
}
```

`Toast.show` / `useToast`、`Dialog.alert` / `useDialog` 同源，挂在 OverlayStack 上，不必再单独套 `ToastProvider` / `DialogProvider`。Kit 浮层（Popup / BottomSheet / Dialog）不再各自开 `RN.Modal`，可同栈叠层；Toast 层级高于 Dialog。

浮层场景用法（声明式 / 命令式 / 请求编排）：见 [`src/overlay/README.md`](../src/overlay/README.md)。

本仓库 App 入口见 `src/app/_layout.tsx`（`AppearanceProvider` → `toUiTheme` → `ConfigProvider`）。

### 按需加载（推荐）

安装 `babel-plugin-import`，并在 `babel.config.js` 配置（本仓已配好）：

```bash
npm install babel-plugin-import -D
```

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["import", { libraryName: "@minibot/ui" }]],
  };
};
```

业务侧统一从根包引入：

```jsx
import { Button, TextField, ThemeProvider, brandLight } from "@minibot/ui";
// 编译后 ≈ import Button from "@minibot/ui/lib/button"; …
```

这样只会带上用到的组件。`libraryDirectory` 默认为 `lib`，无需额外配置。

手动按需（一般不必）：

```jsx
import Button from "@minibot/ui/lib/button";
```

发 npm 前需构建：

```bash
cd packages/ui
npm run build   # → lib/ + es/ + babel 别名 stubs
```

Monorepo 内 Metro 优先走 `exports["react-native"]` 指向 `src/`，改组件无需每次 rebuild。

### 更多

- 包内脚本：`packages/ui/scripts/README.md`（`exports:gen` / `exports:check` / `build`）
- 真机预览：Storybook entry swap

```bash
npm run storybook
npm run storybook:ios
npm run storybook:android
```

## 组件清单（摘要）

| 分组 | 模块名（对应 `lib/<name>`） |
|------|-----------------------------|
| Theme / Config | `theme`、`config` |
| foundation | `text`、`card`、`divider`、`avatar`、`badge`、`chip`、`tag`、`price`、`collapse`、`space`、`flex`、`icon`、`image` |
| controls | `button`、`icon-button`、`switch`、`stepper`、`checkbox`、`radio`、`segmented-control`、`slider`、`tabs`、`rate` |
| forms | `text-field`、…、`picker`（一族）、`time-picker`、`date-picker`、`calendar-picker`、`uploader` |
| lists | `list-group`、`list-row`、`empty-state`、`media-list-item`、`swipe-cell`、`pull-refresh`、`infinite-list` |
| feedback | `spinner`、`skeleton`、`progress-bar`、`toast`、`banner`、`notice-bar`、`steps` |
| overlays | `backdrop`、`dialog`、`bottom-sheet`、`action-sheet`、`dropdown-menu`、`popup`、`image-preview`、`popover` |
| layout | `screen`、`stack-header`、`fab`、`safe-area`、`tab-bar` |
| business | `ticket` |

完整约定与目录结构见包内 [README](../README.md)。

## 链接

- 包 README：[`packages/ui/README.md`](../README.md)
- Token SoT：[mini-design-system](https://github.com/liuyidi/mini-design-system)

## 如何贡献

新增组件目录（含 `index.ts`）后请执行：

```bash
cd packages/ui
npm run exports:gen
npm run exports:check
npm run build
```

并补充对应 `*.stories.tsx`。业务侧统一 `import { … } from "@minibot/ui"`（依赖 babel 按需改写）。
