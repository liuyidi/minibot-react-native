# Flex Adaptive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `Flex` + `Flex.Item` to `@minibot/ui` for fixed-edge + flexible-center layouts (row and column).

**Architecture:** Pure RN `View` + Yoga. `Flex` provides direction/align/justify/gap and a React context for `direction`. `Flex.Item` defaults to `flex: 1` with `minWidth: 0` (row) or `minHeight: 0` (column). Mirror `Space` prop naming; do not change `Space`.

**Tech Stack:** React Native, TypeScript, Storybook RN, `exports:gen` for short-path maps.

**Spec:** `docs/superpowers/specs/2026-09-11-minibot-ui-flex-design.md`

## Global Constraints

- Pure `View` + Yoga — no gesture-handler / reanimated
- `Flex = Object.assign(FlexRoot, { Item: FlexItem })`
- Do not modify `Space` / `StackHeader` / `ListRow` behavior
- Align/justify short names match `Space` (`between`, `around`, …)
- No unit-test harness in `packages/ui` today — verify via TypeScript + Storybook + `exports:check`
- Gallery Chinese label: `Flex 弹性布局`

---

## File map

| Path | Role |
|------|------|
| Create `packages/ui/src/components/foundation/flex/Flex.tsx` | `Flex`, `Flex.Item`, context, types |
| Create `packages/ui/src/components/foundation/flex/index.ts` | barrel + default |
| Create `packages/ui/src/components/foundation/flex/Flex.stories.tsx` | Family gallery |
| Modify `packages/ui/src/index.ts` | root exports (after Space) |
| Modify `.rnstorybook/GalleryUI.tsx` | `Flex: "弹性布局"` |
| Modify `packages/ui/docs/introduce.zh-CN.md` | foundation row includes `flex` |
| Run `npm run exports:gen` in `packages/ui` | regenerate short-path / babel maps |

---

### Task 1: Flex + Flex.Item implementation

**Files:**
- Create: `packages/ui/src/components/foundation/flex/Flex.tsx`
- Create: `packages/ui/src/components/foundation/flex/index.ts`
- Modify: `packages/ui/src/index.ts` (insert after Space exports)

**Interfaces:**
- Produces: `Flex`, `Flex.Item`, types `FlexProps`, `FlexItemProps`, `FlexDirection`, `FlexAlign`, `FlexJustify`

- [ ] **Step 1: Create `Flex.tsx`**

```tsx
import { createContext, useContext, type ReactNode } from "react";
import {
  View,
  type FlexAlignType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type FlexDirection = "horizontal" | "vertical";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly";

export type FlexProps = {
  children?: ReactNode;
  /** @default horizontal */
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  /** @default false */
  wrap?: boolean;
  /** @default 0 */
  gap?: number;
  gapHorizontal?: number;
  gapVertical?: number;
  /** Stretch to parent width when horizontal. @default true */
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type FlexItemProps = {
  children?: ReactNode;
  /** @default 1 */
  flex?: number;
  style?: StyleProp<ViewStyle>;
};

type FlexContextValue = { direction: FlexDirection };

const FlexContext = createContext<FlexContextValue>({
  direction: "horizontal",
});

const ALIGN_MAP: Record<FlexAlign, FlexAlignType> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
};

const JUSTIFY_MAP: Record<FlexJustify, ViewStyle["justifyContent"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

function FlexRoot({
  children,
  direction = "horizontal",
  align,
  justify,
  wrap = false,
  gap = 0,
  gapHorizontal,
  gapVertical,
  block = true,
  style,
}: FlexProps) {
  const horizontal = direction === "horizontal";
  const rowGap = gapVertical ?? gap;
  const columnGap = gapHorizontal ?? gap;

  return (
    <FlexContext.Provider value={{ direction }}>
      <View
        style={[
          {
            flexDirection: horizontal ? "row" : "column",
            flexWrap: wrap && horizontal ? "wrap" : "nowrap",
            alignItems: align ? ALIGN_MAP[align] : undefined,
            justifyContent: justify ? JUSTIFY_MAP[justify] : undefined,
            columnGap,
            rowGap,
            alignSelf: block || !horizontal ? "stretch" : "flex-start",
            width: block && horizontal ? "100%" : undefined,
          },
          style,
        ]}
      >
        {children}
      </View>
    </FlexContext.Provider>
  );
}

function FlexItem({ children, flex = 1, style }: FlexItemProps) {
  const { direction } = useContext(FlexContext);
  const horizontal = direction === "horizontal";

  return (
    <View
      style={[
        {
          flex,
          minWidth: horizontal ? 0 : undefined,
          minHeight: horizontal ? undefined : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Fixed edges + flexible center. Pair with `Flex.Item` for the growing slot. */
export const Flex = Object.assign(FlexRoot, { Item: FlexItem });
```

- [ ] **Step 2: Create `index.ts`**

```ts
export * from "./Flex";
export { Flex as default } from "./Flex";
```

- [ ] **Step 3: Wire root barrel**

In `packages/ui/src/index.ts`, immediately after the `Space` type exports block, add:

```ts
export { Flex } from "./components/foundation/flex";
export type {
  FlexProps,
  FlexItemProps,
  FlexDirection,
  FlexAlign,
  FlexJustify,
} from "./components/foundation/flex";
```

- [ ] **Step 4: Typecheck the package surface**

Run from repo root (or `packages/ui` if it has its own check):

```bash
cd /Users/liuyidi/github/minibot-react-native && npx tsc -p packages/ui --noEmit
```

Expected: no errors referencing `foundation/flex`.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components/foundation/flex/Flex.tsx \
  packages/ui/src/components/foundation/flex/index.ts \
  packages/ui/src/index.ts
git commit -m "$(cat <<'EOF'
feat(ui): add Flex and Flex.Item layout primitives

EOF
)"
```

---

### Task 2: Storybook + Gallery + exports + docs

**Files:**
- Create: `packages/ui/src/components/foundation/flex/Flex.stories.tsx`
- Modify: `.rnstorybook/GalleryUI.tsx` (`COMPONENT_ZH`)
- Modify: `packages/ui/docs/introduce.zh-CN.md` (foundation inventory row)
- Regenerate: `packages/ui/scripts/short-path-map.json`, `entries.json`, `babel-aliases.json`, `package.json` exports via `exports:gen`

**Interfaces:**
- Consumes: `Flex` / `Flex.Item` from Task 1

- [ ] **Step 1: Create `Flex.stories.tsx`**

Mirror `Space.stories.tsx` structure (DemoBlock + ScrollView Family). Include four demos from the spec:

1. Left / center / right with fixed sides + `Flex.Item`
2. Vertical header / scroll body / footer (`direction="vertical"`, parent `flex: 1` or fixed height ~320)
3. `justify="between"` without Item
4. Two items with `flex={1}` and `flex={2}`

Title: `UI/Foundation 基础/Flex`.

Use colored `View` placeholders (e.g. `#EEE` / `#DDD`) and `Text` labels — no theme override required.

- [ ] **Step 2: Gallery Chinese name**

In `.rnstorybook/GalleryUI.tsx` `COMPONENT_ZH`, next to `Space`:

```ts
Flex: "弹性布局",
```

- [ ] **Step 3: Introduce inventory**

In `packages/ui/docs/introduce.zh-CN.md`, foundation row — add `` `flex` `` next to `` `space` ``.

- [ ] **Step 4: Regenerate exports**

```bash
cd /Users/liuyidi/github/minibot-react-native/packages/ui && npm run exports:gen && npm run exports:check
```

Expected: `short-path-map.json` contains `"flex": "./src/components/foundation/flex/index.ts"`; check exits 0.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/components/foundation/flex/Flex.stories.tsx \
  .rnstorybook/GalleryUI.tsx \
  packages/ui/docs/introduce.zh-CN.md \
  packages/ui/scripts/short-path-map.json \
  packages/ui/scripts/entries.json \
  packages/ui/scripts/babel-aliases.json \
  packages/ui/package.json
git commit -m "$(cat <<'EOF'
feat(ui): wire Flex stories, gallery label, and exports

EOF
)"
```

---

## Spec coverage check

| Spec item | Task |
|-----------|------|
| Flex + Item API / defaults | Task 1 |
| Context for direction → minWidth/minHeight | Task 1 |
| Object.assign `.Item` | Task 1 |
| Root export | Task 1 |
| Stories (4 cases) | Task 2 |
| Gallery 中文名 | Task 2 |
| exports:gen + introduce | Task 2 |
| Non-goals (grid/span) | omitted by design |

## Placeholder scan

None — full component source and commands included.
