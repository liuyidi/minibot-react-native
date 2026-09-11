# @minibot/ui — Mini React Native kit

Consumed by the Expo app via `"@minibot/ui": "file:./packages/ui"`.  
Token SoT: [mini-design-system](https://github.com/liuyidi/mini-design-system).

中文介绍：[docs/introduce.zh-CN.md](./docs/introduce.zh-CN.md)。

## Imports（推荐）

从根包按需引入，配合 `babel-plugin-import`（本仓 `babel.config.js` 已配置），编译期改写到 `lib/<name>`，只打包用到的组件：

```tsx
import { Button, TextField, ConfigProvider, brandLight } from "@minibot/ui";
```

```js
// babel.config.js
["import", { libraryName: "@minibot/ui" }]
```

等价手动写法（一般不需要）：

```tsx
import Button from "@minibot/ui/lib/button";
```

发 npm 前构建 `lib/` + `es/`：

```bash
cd packages/ui
npm run exports:gen
npm run exports:check
npm run build
```

## Policy

- **Create-first, replace-later** — new screens import from here; do not mass-migrate `src/components` yet.
- No Expo Router, Gateway, or auth in the kit.
- Colors from **`ConfigProvider`** / `useUiTheme`（`ThemeProvider` 仍可用于 Storybook）；optional per-component `theme` override.
- **Chat / devices domain (§7–§8)** deferred.
- `Slider` wraps `@react-native-community/slider` (app peer) for native drag feel.
- Heavy peers (gesture-handler, reanimated, svg, lucide) stay peers — only apps that import those components need them wired.

## Theme / Config

App 入口只需一层：

```tsx
import { ConfigProvider, brandLight, Button } from "@minibot/ui";

<ConfigProvider theme={brandLight} locale="zh" mode="light">
  <Button onPress={() => {}}>Continue</Button>
</ConfigProvider>
```

`ConfigProvider` 内含 `ThemeProvider` + `RootSiblingParent`（OverlayStack）。`Toast` / `Dialog` 命令式 API 挂在同一栈上。Storybook 仍可单独用 `ThemeProvider`；`ToastProvider` / `DialogProvider` 为兼容 no-op。

浮层用法详见 [src/overlay/README.md](./src/overlay/README.md)。

App wires `AppearanceProvider` → `toUiTheme(palette)` → `ConfigProvider` in `src/app/_layout.tsx`.

## Storybook (entry swap)

Storybook lives in the Expo app (entry swap). From this package:

```bash
cd packages/ui
npm run storybook          # Metro / QR — same as root
npm run storybook:ios
npm run storybook:android
npm run dev                # alias → storybook
```

Or from repo root:

```bash
npm run storybook
npm run storybook:ios
npm run storybook:android
```

When `STORYBOOK_ENABLED` is unset, the normal app entry runs and Storybook is stripped.  
Preview toolbar toggles brand light / dark.

## Inventory (§1–§6)

Layout: `src/components/<group>/<kebab-name>/` with `index.ts` + component + stories.

```text
components/
  overlays/
    action-sheet/
      ActionSheet.tsx
      ActionSheet.stories.tsx
      index.ts
  forms/
    text-field/
      ...
```

| Group | Folders |
|-------|---------|
| Config (`src/config`) | ConfigProvider（theme + locale + Toast/Dialog hosts） |
| Theme (`src/theme`) | ThemeProvider, useUiTheme, useResolvedTheme, brandLight/Dark |
| `foundation` | text, card, divider, avatar, badge, chip, tag, price, collapse, space, icon, image |
| `controls` | button, icon-button, switch, stepper, checkbox, radio, segmented-control, slider, tabs, rate |
| `forms` | … picker / date / time / calendar、uploader |
| `lists` | list-group, list-row, empty-state, media-list-item, swipe-cell, pull-refresh, infinite-list |
| `feedback` | spinner, skeleton, progress-bar, toast, banner, notice-bar, steps |
| `overlays` | backdrop, dialog, bottom-sheet, action-sheet, dropdown-menu, popup, image-preview, popover |
| `layout` | screen, stack-header, fab, safe-area, tab-bar |
| `business` | ticket |

Deferred: ChatBubble, ChatComposer, ApprovalCard, DeviceRow, SessionRow, …
