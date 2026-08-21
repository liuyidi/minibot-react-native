# Phase 0: Tokens + `@minibot/ui` + Hide Tabs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship design-system brand dark + preset SoT, RN brand theme (default), scaffold `@minibot/ui`, and hide Knowledge/Discover tab entries without deleting code.

**Architecture:** `mini-design-system` owns DTCG JSON (brand light/dark + claude/codex). RN maps tokens into existing `ThemePalette` via a new `brand` preset. `packages/ui` is a private Expo-consumable kit that re-exports theme helpers and hosts new primitives only.

**Tech Stack:** Expo 54, React Native, TypeScript, DTCG JSON tokens, Metro `file:` package.

**Spec:** `docs/superpowers/specs/2026-08-21-mobile-rebuild-design.md`

## Global Constraints

- Edit in place under `src/` (no `src-next/` copy)
- Knowledge / Discover: hide entries only; keep route files
- Default theme: **brand**; keep Claude / Codex selectable
- Brand must support light + dark
- Change design-system tokens before / with RN consumption
- `@minibot/ui`: create-first, do not mass-replace existing screens
- Kit must not depend on Expo Router, Gateway, or auth

## File map

| Path | Responsibility |
|------|----------------|
| `mini-design-system/tokens/mini-brand.tokens.json` | Brand light + dark SoT |
| `mini-design-system/tokens/mini-brand.tokens.css` | CSS vars + `.dark` / `[data-theme=dark]` |
| `mini-design-system/tokens/bridge.css` | Semantic bridge for dark |
| `mini-design-system/tokens/presets/claude.tokens.json` | Claude light/dark |
| `mini-design-system/tokens/presets/codex.tokens.json` | Codex light/dark |
| `mini-design-system/rules/mini-brand-rules.md` | Note dark + RN kit |
| `minibot-react-native/src/lib/theme/presets/brand.ts` | Brand → ThemePalette |
| `minibot-react-native/src/lib/theme/types.ts` | `ThemeId` includes `brand` |
| `minibot-react-native/src/lib/theme/registry.ts` | Register brand; default brand |
| `minibot-react-native/packages/ui/*` | `@minibot/ui` scaffold + Button |
| `minibot-react-native/metro.config.js` | Watch `packages/ui` |
| `minibot-react-native/src/app/(tabs)/_layout.tsx` | Hide knowledge/discover |

---

### Task 1: Brand dark tokens in mini-design-system

**Files:**
- Modify: `mini-design-system/tokens/mini-brand.tokens.json`
- Modify: `mini-design-system/tokens/mini-brand.tokens.css`
- Modify: `mini-design-system/tokens/bridge.css`
- Modify: `mini-design-system/rules/mini-brand-rules.md`

**Interfaces:**
- Produces: DTCG `mini.color.*` with `$extensions.mode.dark` or nested `light`/`dark` groups; CSS `--mini-color-*` under `:root` and `.dark`

- [x] **Step 1:** Extend `mini-brand.tokens.json` so each color has light (current) + dark values. Prefer DTCG mode extension:

```json
"canvas": {
  "$type": "color",
  "$value": "#ffffff",
  "$extensions": {
    "mode": { "dark": "#080808" }
  }
}
```

Dark palette (Direction 02 quiet invert):
- canvas `#080808`, ink `#f5f5f5`, inkSoft `#e8e8e8`, muted `#a3a3a3`, subtle `#8a8a8a`
- surface `#141414`, surfaceHover `#1f1f1f`, border `#404040`, borderSoft `#2a2a2a`
- focus `#818cf8` (indigo lighter for dark), keep semantic status with dark-appropriate surfaces

- [ ] **Step 2:** Update `mini-brand.tokens.css` with matching `.dark, [data-theme="dark"]` block.

- [ ] **Step 3:** Extend `bridge.css` with `.dark` semantic mappings (`--background` → dark canvas, `--primary` → light ink, etc.).

- [ ] **Step 4:** Update `rules/mini-brand-rules.md`: dark is supported for brand; RN kit incubates as `@minibot/ui` in `minibot-react-native/packages/ui`.

- [ ] **Step 5:** Spot-check by opening Direction 02 HTML with `data-theme="dark"` if preview supports it; otherwise verify CSS var names compile mentally against JSON.

---

### Task 2: Claude / Codex preset JSON in design-system

**Files:**
- Create: `mini-design-system/tokens/presets/claude.tokens.json`
- Create: `mini-design-system/tokens/presets/codex.tokens.json`
- Modify: `mini-design-system/README.md` (list presets)

**Interfaces:**
- Produces: preset files mirroring RN `ThemePalette` keys under `light` / `dark` for sync

- [ ] **Step 1:** Write `claude.tokens.json` and `codex.tokens.json` from current RN `presets/claude.ts` / `codex.ts` values (source of export for this backfill).

- [ ] **Step 2:** Document in design-system README that presets live under `tokens/presets/`.

---

### Task 3: RN brand theme + default

**Files:**
- Create: `minibot-react-native/src/lib/theme/presets/brand.ts`
- Modify: `minibot-react-native/src/lib/theme/types.ts`
- Modify: `minibot-react-native/src/lib/theme/registry.ts`
- Modify: `minibot-react-native/src/lib/theme/index.ts`
- Test: `minibot-react-native/src/lib/theme/__tests__/registry.test.ts`

**Interfaces:**
- Consumes: brand dark/light from Task 1 (mapped into `ThemePalette`)
- Produces: `ThemeId = "brand" | "codex" | "claude"`; `DEFAULT_THEME_ID = "brand"`

- [ ] **Step 1: Write failing test**

```ts
import { DEFAULT_THEME_ID, isThemeId, resolveThemePalette } from "@/lib/theme/registry";

test("default theme is brand", () => {
  expect(DEFAULT_THEME_ID).toBe("brand");
});

test("brand light uses white canvas and black primary", () => {
  const p = resolveThemePalette("brand", "light");
  expect(p.background).toBe("#ffffff");
  expect(p.primary).toBe("#080808");
  expect(p.onPrimary).toBe("#ffffff");
});

test("brand dark inverts canvas/ink", () => {
  const p = resolveThemePalette("brand", "dark");
  expect(p.background).toBe("#080808");
  expect(p.text).toBe("#f5f5f5");
});

test("isThemeId accepts brand", () => {
  expect(isThemeId("brand")).toBe(true);
});
```

- [ ] **Step 2:** Run `cd minibot-react-native && npx jest src/lib/theme/__tests__/registry.test.ts --watchAll=false` — expect FAIL.

- [ ] **Step 3:** Implement `brand.ts` mapping mini tokens → `ThemePalette` (chat bubbles: userBubble = surface, etc.). Update types/registry/index.

- [ ] **Step 4:** Re-run test — expect PASS.

---

### Task 4: Scaffold `@minibot/ui` + first Button

**Files:**
- Create: `packages/ui/package.json`, `tsconfig.json`, `src/index.ts`, `src/theme/types.ts`, `src/components/Button.tsx`, `README.md`
- Modify: root `package.json` (`"@minibot/ui": "file:./packages/ui"`)
- Modify: `metro.config.js`, `tsconfig.json` paths
- Test: `packages/ui/src/components/Button.test.tsx` (optional lightweight) or theme export smoke in app test

**Interfaces:**
- Produces: `import { Button } from "@minibot/ui"` with `variant: "primary" | "secondary"`
- Kit accepts `colors: { primary, onPrimary, surface, text, border }` via props or ThemeProvider later; Phase 0 use explicit `palette` prop to avoid coupling to app context

- [ ] **Step 1:** Create package with peerDeps `react`, `react-native`.

- [ ] **Step 2:** Implement `Button` using StyleSheet + palette prop.

- [ ] **Step 3:** Wire Metro watchFolders + tsconfig paths + root dependency; run `npm install` in app root.

- [ ] **Step 4:** Verify resolve: `npx tsc --noEmit` or import in a throwaway comment; do **not** replace login button yet unless trivial.

---

### Task 5: Hide Knowledge / Discover tabs

**Files:**
- Modify: `src/app/(tabs)/_layout.tsx`
- Keep: `src/app/(tabs)/knowledge.tsx`, `discover.tsx`

- [ ] **Step 1:** Set `href: null` (Expo Router) on knowledge and discover `Tabs.Screen` options so they stay in the file tree but leave the tab bar.

```tsx
<Tabs.Screen
  name="knowledge"
  options={{ href: null, title: t('tabs.knowledge'), /* icon optional */ }}
/>
```

- [ ] **Step 2:** Confirm only Chat + Me appear; deep link to `/knowledge` still possible if needed later.

---

### Task 6: Sync script stub (optional thin)

**Files:**
- Create: `minibot-react-native/scripts/sync-design-tokens.mjs` (copies JSON from sibling `../mini-design-system/tokens` into `src/lib/theme/tokens/source/`)
- Create: `src/lib/theme/tokens/source/README.md` noting SoT path

- [ ] **Step 1:** Script copies brand + presets JSON; document run order in script header.
- [ ] **Step 2:** Run once so source files exist in RN repo.

---

## Phase 1+ (separate plans)

Do not expand this plan into Chat MVP / Timeline / hubs. Next plan: `2026-08-21-phase1-chat-mvp.md` after Phase 0 lands.
