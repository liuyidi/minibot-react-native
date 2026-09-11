# Skeleton 骨架屏 — Design

Date: 2026-09-11  
Status: approved  
Reference: [Vant Skeleton](https://vant-ui.github.io/vant/#/zh-CN/skeleton)

## Goal

Replace the primitive single-block `Skeleton` (`width` / `height` / `borderRadius`) with a Vant-aligned compound skeleton used during content loading.

## Decision

**Replace** the old API (no compatibility shim). Call sites are only Storybook + package export.

## API

### `Skeleton`

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `boolean` | `false` | Title bar placeholder |
| `titleWidth` | `number \| \`${number}%\`` | `"40%"` | |
| `avatar` | `boolean` | `false` | |
| `avatarSize` | `number` | `32` | |
| `avatarShape` | `"round" \| "square"` | `"round"` | |
| `row` | `number` | `0` | Paragraph count |
| `rowWidth` | `Dim \| Dim[]` | `"100%"` | Last row defaults to `60%` when using default width |
| `round` | `boolean` | `false` | Rounded title/paragraph ends |
| `animate` | `boolean` | `true` | Shared opacity pulse |
| `loading` | `boolean` | `true` | `false` → render `children` |
| `children` | `ReactNode` | — | Real content when not loading |
| `template` | `ReactNode` | — | Custom skeleton body (`Skeleton.Image` / …) |
| `theme` / `style` | usual | | |

`Dim = number | \`${number}%\``

### Subcomponents (custom layouts)

- `Skeleton.Avatar` — `size?`, `shape?`
- `Skeleton.Title` — `width?`
- `Skeleton.Paragraph` — `width?`
- `Skeleton.Image` — `width?` `height?` (default 96×96), `radius?`

All bones share theme `surface` fill + optional pulse via context/`animate`.

## Demos

1. 基础用法 — `title` + `row={3}`
2. 显示头像 — + `avatar`
3. 展示子组件 — Switch toggles `loading`
4. 自定义内容 — Image + Paragraphs
5. 圆角 — `round`

## Out of scope

- Sweep / shimmer animation (keep opacity pulse)
- CSS-variable theming table
- Old block API compatibility

## Files

- Rewrite `packages/ui/src/components/feedback/skeleton/Skeleton.tsx`
- Rewrite `Skeleton.stories.tsx`
- Update `index.ts` exports for subcomponents + types
