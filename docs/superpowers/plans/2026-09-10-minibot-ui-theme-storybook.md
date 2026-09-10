# `@minibot/ui` ThemeProvider + Storybook + Kit §1–§6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship ThemeProvider, Storybook entry-swap, and all §1–§6 mobile kit components with stories; wire App provider + MiniLoginScreen; defer §7/§8.

**Architecture:** `@minibot/ui` owns `UiTheme` + `ThemeProvider` + presentational components (no Expo Router/auth). App `AppearanceProvider` resolves `ThemePalette` and maps into kit `ThemeProvider`. Storybook uses `STORYBOOK_ENABLED` entry swap; stories live beside components under `packages/ui`.

**Tech Stack:** Expo 57, React Native 0.86, `@storybook/react-native` v10+, Jest/jest-expo, TypeScript.

**Spec:** `docs/superpowers/specs/2026-09-10-minibot-ui-theme-storybook-design.md`

## Global Constraints

- Kit must not depend on Expo Router, Gateway, auth, or lucide.
- Icons via `ReactNode` slots only.
- Components require `ThemeProvider`; optional `theme?: Partial<UiTheme>` override.
- Create-first: no bulk migration of settings/chat screens.
- Breaking OK for Button/TextField: remove required `palette` props.
- First pass = structure + theme + ≥1 story each; polish later.
- Do not set `STORYBOOK_ENABLED` in EAS/production.
- Commits: conventional (`feat(ui)`, `chore(ui)`, `docs`).

## File map

```text
packages/ui/src/
  theme/
    types.ts              # UiTheme
    ThemeProvider.tsx     # Provider + useUiTheme + useResolvedTheme
    presets.ts            # brandLight / brandDark
    index.ts
  components/
    Button.tsx + .stories.tsx
    TextField.tsx + .stories.tsx
    Text.tsx, IconButton.tsx, TextArea.tsx, Card.tsx, Divider.tsx,
    Spinner.tsx, Skeleton.tsx, Badge.tsx, Avatar.tsx, Chip.tsx
    Switch.tsx, Checkbox.tsx, Radio.tsx, SegmentedControl.tsx,
    Slider.tsx, ProgressBar.tsx
    ListGroup.tsx, ListRow.tsx, SearchBar.tsx, EmptyState.tsx, Tabs.tsx
    Backdrop.tsx, Dialog.tsx, BottomSheet.tsx, ActionSheet.tsx,
    Toast.tsx, Banner.tsx
    FormField.tsx, OTPInput.tsx, PasswordField.tsx, PickerRow.tsx
    Screen.tsx, StackHeader.tsx, FAB.tsx
    (+ matching *.stories.tsx)
  index.ts
.rnstorybook/             # Storybook config
src/lib/theme/toUiTheme.ts
src/app/_layout.tsx       # mount ThemeProvider
src/components/auth/MiniLoginScreen.tsx
metro.config.js
package.json              # storybook scripts
packages/ui/README.md
```

---

### Task 1: ThemeProvider + UiTheme + presets

**Files:**
- Create: `packages/ui/src/theme/ThemeProvider.tsx`
- Create: `packages/ui/src/theme/presets.ts`
- Modify: `packages/ui/src/theme/types.ts`
- Create: `packages/ui/src/theme/index.ts`
- Modify: `packages/ui/src/index.ts`
- Test: `packages/ui/src/theme/ThemeProvider.test.tsx` (or under `src/` with jest if package has no jest — prefer app jest resolving `@minibot/ui`)

**Interfaces:**
- Produces:
  - `type UiTheme = { text, textSecondary, heading, background, card, border, primary, onPrimary, muted, red, focus, green, yellow, surface }`
  - `ThemeProvider({ theme, children })`
  - `useUiTheme(): UiTheme`
  - `useResolvedTheme(override?: Partial<UiTheme>): UiTheme`
  - `brandLight`, `brandDark: UiTheme`

- [ ] **Step 1: Define `UiTheme` and remove obsolete `ButtonPalette`-only export (keep re-export alias if needed briefly)**

```ts
// packages/ui/src/theme/types.ts
export type UiTheme = {
  text: string;
  textSecondary: string;
  heading: string;
  background: string;
  card: string;
  border: string;
  primary: string;
  onPrimary: string;
  muted: string;
  red: string;
  focus: string;
  green: string;
  yellow: string;
  /** Secondary button / chip fill */
  surface: string;
};
```

- [ ] **Step 2: Implement ThemeProvider**

```tsx
// packages/ui/src/theme/ThemeProvider.tsx
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { UiTheme } from "./types";

const ThemeContext = createContext<UiTheme | null>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: UiTheme;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useUiTheme(): UiTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useUiTheme must be used within ThemeProvider");
  }
  return theme;
}

export function useResolvedTheme(override?: Partial<UiTheme>): UiTheme {
  const base = useUiTheme();
  return useMemo(
    () => (override ? { ...base, ...override } : base),
    [base, override]
  );
}
```

- [ ] **Step 3: Add brandLight / brandDark from Direction 02 values (mirror app brand preset)**

- [ ] **Step 4: Export from `packages/ui/src/index.ts`**

- [ ] **Step 5: Commit** `feat(ui): add ThemeProvider and UiTheme`

---

### Task 2: Migrate Button + TextField to ThemeProvider

**Files:**
- Modify: `packages/ui/src/components/Button.tsx`
- Modify: `packages/ui/src/components/TextField.tsx`
- Create: `packages/ui/src/components/Button.stories.tsx`
- Create: `packages/ui/src/components/TextField.stories.tsx`

**Interfaces:**
- Consumes: `useResolvedTheme`
- Produces: `Button` without required `palette`; variants `primary | secondary | ghost | destructive`
- Produces: `TextField` with optional `error?: string`; no required `palette`

- [ ] **Step 1: Rewrite Button to use `useResolvedTheme(theme?)`; add ghost/destructive**

- [ ] **Step 2: Rewrite TextField similarly; show error text in `red`**

- [ ] **Step 3: Add stories (will wire fully in Task 4; file can use CSF3)**

- [ ] **Step 4: Commit** `feat(ui): theme-aware Button and TextField`

---

### Task 3: App ThemeProvider wiring + MiniLoginScreen

**Files:**
- Create: `src/lib/theme/toUiTheme.ts`
- Modify: `src/app/_layout.tsx`
- Modify: `src/components/auth/MiniLoginScreen.tsx`

**Interfaces:**
- Produces: `toUiTheme(palette: ThemePalette): UiTheme` mapping `surface` ← `lightGray` or card-adjacent; `focus` ← link/indigo `#4f46e5` or palette-compatible

- [ ] **Step 1: Add mapper**

```ts
import type { UiTheme } from "@minibot/ui";
import type { ThemePalette } from "@/lib/theme/types";

export function toUiTheme(p: ThemePalette): UiTheme {
  return {
    text: p.text,
    textSecondary: p.textSecondary,
    heading: p.heading,
    background: p.background,
    card: p.card,
    border: p.border,
    primary: p.primary,
    onPrimary: p.onPrimary,
    muted: p.muted,
    red: p.red,
    focus: "#4f46e5",
    green: p.green,
    yellow: p.yellow,
    surface: p.lightGray,
  };
}
```

- [ ] **Step 2: Under `AppearanceProvider`, wrap children with kit `ThemeProvider theme={toUiTheme(palette)}` (needs inner component that calls `useAppearance`)**

- [ ] **Step 3: Strip MiniLoginScreen local palettes; use themed Button/TextField**

- [ ] **Step 4: Smoke — TypeScript / app still imports cleanly**

- [ ] **Step 5: Commit** `feat(app): mount @minibot/ui ThemeProvider`

---

### Task 4: Storybook entry-swap setup

**Files:**
- Create: `.rnstorybook/main.ts`, `.rnstorybook/preview.tsx`, etc. via CLI
- Modify: `metro.config.js`
- Modify: `package.json` scripts
- Modify: `.gitignore` if Storybook generates requires

- [ ] **Step 1: Install** `npx create-storybook@latest` / `npm create storybook -- --type react_native --yes` (or current RN docs command); choose React Native recommended

- [ ] **Step 2: Wrap metro with `withStorybook`; keep watchFolders + `@minibot/ui` alias**

- [ ] **Step 3: Configure `stories` globs to include `../packages/ui/src/**/*.stories.?(ts|tsx)`**

- [ ] **Step 4: Preview decorator: ThemeProvider + toolbar light/dark using `brandLight`/`brandDark`**

- [ ] **Step 5: Add scripts `storybook`, `storybook:ios`, `storybook:android`**

- [ ] **Step 6: Verify `STORYBOOK_ENABLED` unset → normal app entry unchanged**

- [ ] **Step 7: Commit** `chore(ui): add Storybook RN entry-swap`

---

### Task 5: Foundation components (§1 remainder)

**Files:** Create under `packages/ui/src/components/`:
`Text`, `IconButton`, `TextArea`, `Card`, `Divider`, `Spinner`, `Skeleton`, `Badge`, `Avatar`, `Chip` (+ stories); update `index.ts`

**Pattern for each:**
- `useResolvedTheme(theme?)`
- Export from barrel
- One default story

- [ ] **Step 1: Implement Text** (`variant: body|title|subtitle|caption|label`)
- [ ] **Step 2: IconButton, TextArea, Card, Divider, Spinner**
- [ ] **Step 3: Skeleton, Badge, Avatar, Chip**
- [ ] **Step 4: Stories + exports**
- [ ] **Step 5: Commit** `feat(ui): add foundation primitives`

---

### Task 6: Controls (§2)

**Files:** `Switch`, `Checkbox`, `Radio`(+`RadioGroup`), `SegmentedControl`, `Slider`, `ProgressBar` + stories

- [ ] **Step 1: Switch, Checkbox, Radio/RadioGroup**
- [ ] **Step 2: SegmentedControl, Slider, ProgressBar**
- [ ] **Step 3: Stories + exports + commit** `feat(ui): add control components`

---

### Task 7: Lists (§3)

**Files:** `ListGroup`, `ListRow`, `SearchBar`, `EmptyState`, `Tabs` + stories

- [ ] **Step 1: ListGroup + ListRow** (align SettingsGroup/NavRow visuals; no lucide)
- [ ] **Step 2: SearchBar, EmptyState, Tabs**
- [ ] **Step 3: Stories + exports + commit** `feat(ui): add list components`

---

### Task 8: Overlays (§4) including BottomSheet

**Files:** `Backdrop`, `Dialog`, `BottomSheet`, `ActionSheet`, `Toast`, `Banner` + stories

**BottomSheet contract:**
```tsx
type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  /** default ~0.5 of screen height */
  heightRatio?: number;
  children: ReactNode;
};
```
Implement with RN `Modal` + slide-up panel + Backdrop; close via X and backdrop press.

- [ ] **Step 1: Backdrop + Dialog**
- [ ] **Step 2: BottomSheet (half-sheet + mask + close)**
- [ ] **Step 3: ActionSheet, Toast host, Banner/InlineAlert**
- [ ] **Step 4: Stories + exports + commit** `feat(ui): add overlay components`

---

### Task 9: Forms (§5)

**Files:** `FormField`, `OTPInput`, `PasswordField`, `PickerRow` + stories

- [ ] **Step 1: FormField + PasswordField**
- [ ] **Step 2: OTPInput + PickerRow**
- [ ] **Step 3: Stories + exports + commit** `feat(ui): add form components`

---

### Task 10: Chrome (§6) + README

**Files:** `Screen`, `StackHeader`, `FAB` + stories; `packages/ui/README.md`

- [ ] **Step 1: Screen, StackHeader, FAB**
- [ ] **Step 2: Update README — ThemeProvider, Storybook scripts, §1–§6 inventory, deferred §7/§8**
- [ ] **Step 3: Commit** `feat(ui): add chrome components and docs`

---

### Task 11: Acceptance sweep

- [ ] Confirm all §1–§6 exported from `@minibot/ui`
- [ ] Confirm each has a `.stories.tsx`
- [ ] `npx tsc --noEmit` (or project typecheck) passes
- [ ] Jest smoke for ThemeProvider / Button if present
- [ ] Final commit if doc/export gaps: `chore(ui): kit §1–§6 acceptance fixes`

---

## Spec coverage checklist

| Spec item | Task |
|-----------|------|
| ThemeProvider / UiTheme / presets | 1 |
| Button/TextField migration | 2 |
| App provider + MiniLogin | 3 |
| Storybook entry swap | 4 |
| §1 Foundation | 1–2, 5 |
| §2 Controls | 6 |
| §3 Lists | 7 |
| §4 Overlays + BottomSheet | 8 |
| §5 Forms | 9 |
| §6 Chrome | 10 |
| README | 10 |
| §7/§8 deferred | documented only |
