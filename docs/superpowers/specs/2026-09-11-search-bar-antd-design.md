# SearchBar 搜索栏 — Design

Date: 2026-09-11  
Status: approved  
Reference: [antd-mobile SearchBar](https://mobile.ant.design/zh/components/search-bar/)

## Goal

Replace the thin `TextInput` wrapper with an antd-mobile-aligned SearchBar (cancel button, `onSearch`, controlled clear timing).

## Decision

**Replace** the old API (`onChangeText` / `TextInputProps` passthrough). Call sites are Storybook only.

## Layout

```
[ searchIcon ] [ TextInput …… ] [ clear? ]   [ 取消? ]
└────────── input-box (surface, rounded) ──┘
```

## API

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `string` | `""` | Controlled / uncontrolled |
| `placeholder` | `string` | — | |
| `maxLength` | `number` | — | |
| `clearable` | `boolean` | `true` | |
| `onlyShowClearWhenFocus` | `boolean` | `false` | Clear only while focused |
| `showCancelButton` | `boolean \| (focus, value) => boolean` | `false` | `true` → show on focus |
| `cancelText` | `string` | `"取消"` | |
| `clearOnCancel` | `boolean` | `true` | |
| `searchIcon` | `ReactNode` | Lucide `Search` via `Icon` | `null` hides |
| `autoFocus` | `boolean` | — | |
| `onChange` | `(val: string) => void` | — | |
| `onSearch` | `(val: string) => void` | — | Keyboard search / enter |
| `onCancel` / `onClear` / `onFocus` / `onBlur` | — | — | |
| `theme` / `style` | usual | | |

**Ref**: `focus()` / `blur()` / `clear()`

### Cancel visibility (antd behavior)

- `showCancelButton === true` → visible only while focused
- `typeof showCancelButton === "function"` → `showCancelButton(focus, value)`
- Tap cancel: optional clear → blur → `onCancel`

## Demos

1. 基础用法
2. 获取焦点后显示取消按钮 (`showCancelButton`)
3. 取消按钮始终展示 (`showCancelButton={() => true}`)
4. 自定义取消按钮展示时机
5. （可选）自定义搜索图标

## Out of scope

- CSS variables
- Composition start/end events
- Full `TextInputProps` passthrough

## Files

- Rewrite `packages/ui/src/components/forms/search-bar/SearchBar.tsx`
- Rewrite `SearchBar.stories.tsx`
- Update package `index.ts` exports if types change
