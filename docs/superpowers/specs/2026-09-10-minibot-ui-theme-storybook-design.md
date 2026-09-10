# `@minibot/ui` ThemeProvider + Storybook + Mobile Kit (1–6)

**Date:** 2026-09-10  
**Repo:** `minibot-react-native`  
**Status:** Draft for implementation planning  

## Goal

Grow incubating `@minibot/ui` into a usable mobile kit:

1. Introduce **ThemeProvider** now (few consumers → cheap API break).
2. Add **Storybook for React Native** via **entry-point swap**.
3. Ship **foundation through chrome** components (§1–§6) with stories; polish later per component.
4. **Defer** chat/agent (§7) and devices/session domain rows (§8).

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Theming end-state | `ThemeProvider` + `useUiTheme()` now; optional per-component theme override |
| Storybook mode | Entry swap (`STORYBOOK_ENABLED=true`); no `/storybook` Expo Router route |
| Delivery scope | §1–§6 together; §7/§8 later |
| Bottom “popup” | Named **BottomSheet** (slide-up half sheet + backdrop + close) |
| Icons in kit | `ReactNode` slots only — no lucide dependency in `@minibot/ui` |
| App migration | Create-first: wire Provider + fix `MiniLoginScreen`; do not bulk-replace settings/chat screens |

## Architecture

### Theme layer (`packages/ui`)

- **`UiTheme`**: colors the kit actually needs (`text`, `textSecondary`, `heading`, `background`, `card`, `border`, `primary`, `onPrimary`, `muted`, `red`, `focus`, `green`, `yellow`, …). Keep narrower than App `ThemePalette` where possible; provide `toUiTheme(palette)` mapper in the app (or accept compatible structural subset).
- **`ThemeProvider` / `useUiTheme()`**: required for themed components; throw a clear error if missing.
- **Override**: optional `theme?: Partial<UiTheme>` (or full) on primitives for escape hatches / stories.
- **Presets in kit**: brand `light` / `dark` objects for Storybook + docs only. App remains SoT for themeId / appearance mode / persistence (`AppearanceProvider`).
- **Non-goals for kit**: no AsyncStorage, no `themeId`, no Expo Router, no auth.

### App wiring

```text
AppearanceProvider          ← mode, themeId, resolve ThemePalette
  └─ UiThemeProvider        ← theme={toUiTheme(palette)}
       └─ … app tree
```

- Mount kit provider under `AppearanceProvider` in `src/app/_layout.tsx`.
- `MiniLoginScreen`: remove local `buttonPalette` / `fieldPalette`; consume provider (login may stay light-brand via parent palette or a local provider wrap if auth stays light-only).

### Storybook (entry swap)

```text
.rnstorybook/                 # main, preview, generated requires
packages/ui/src/
  theme/
  components/*.tsx
  components/*.stories.tsx
```

- Metro: wrap existing config with Storybook `withStorybook` (bundler-agnostic entry swap when `STORYBOOK_ENABLED=true`); preserve `watchFolders` + `@minibot/ui` alias.
- Scripts:
  - `storybook` → `STORYBOOK_ENABLED=true expo start`
  - `storybook:ios` / `storybook:android` variants
- Preview: decorator wraps `ThemeProvider`; toolbar toggles brand light | dark.
- Production / EAS: do **not** set `STORYBOOK_ENABLED`; Storybook must be stripped / no-op.

## Component inventory (this plan: §1–§6)

First pass = structure + theme + stories. Motion, a11y polish, and edge cases are follow-ups per component.

### §1 Foundation

| Component | Notes |
|-----------|--------|
| ThemeProvider / useUiTheme | Required |
| Text | Variants: `body` \| `title` \| `subtitle` \| `caption` \| `label` |
| Button | `primary` \| `secondary` \| `ghost` \| `destructive`; `loading?` |
| IconButton | Icon slot + hit target |
| TextField | Label / hint / error + TextInput props |
| TextArea | Multiline |
| Card | Rounded surface + border |
| Divider | Hairline; optional inset |
| Spinner | Uses primary / muted |
| Skeleton | Pulse/placeholder block(s) |
| Badge | Count or soft label |
| Avatar | Image URI or initials |
| Chip | Filter / status tag |

`Spacer` optional — prefer explicit style/`gap` unless a tiny helper proves useful.

### §2 Controls

| Component | Notes |
|-----------|--------|
| Switch | Settings toggles |
| Checkbox | Multi-select |
| Radio / RadioGroup | Single-select |
| SegmentedControl | Appearance / language style |
| Slider | Include skeleton API; polish later if unused |
| ProgressBar | Determinate |

### §3 Lists

| Component | Notes |
|-----------|--------|
| ListGroup | Group card + optional title (SettingsGroup shape) |
| ListRow | Title, value, onPress, destructive, divider; leading/trailing `ReactNode` |
| SearchBar | Text input + clear |
| EmptyState | Title, description, optional CTA |
| Tabs | In-page secondary tabs (not Expo Router tab bar) |

### §4 Overlays / popups

| Component | Notes |
|-----------|--------|
| Backdrop | Dimmed pressable mask |
| Dialog | Centered modal (confirm / small form) |
| **BottomSheet** | Slide-up half (or configurable height) sheet; backdrop; close button; optional title; scrollable body — **this is the “从下到上半屏浮层”** |
| ActionSheet | Bottom list of actions (lighter than freeform sheet) |
| Toast | Transient message API (imperative or simple host) |
| Banner / InlineAlert | Inline error / info |

Deferred within overlays (not required for §1–§6 pass unless cheap): Popover, Tooltip, DropdownMenu, ContextMenu.

### §5 Forms

| Component | Notes |
|-----------|--------|
| FormField | Label + control slot + error |
| OTPInput | Auth code entry |
| PasswordField | Show/hide toggle |
| Select / PickerRow | Row that opens sheet or navigates to pick |

### §6 Chrome

| Component | Notes |
|-----------|--------|
| Screen | Background + safe area padding helper |
| StackHeader | Back + title (+ optional trailing) |
| FAB | Optional floating primary action |

## Deferred (§7 / §8)

| § | Components (later) |
|---|-------------------|
| 7 Chat / agent | ChatBubble, ChatComposer, AttachmentCard, ApprovalCard, ToolProgressCard, TypingIndicator, ConnectionBadge |
| 8 Account / devices | DeviceRow, SessionRow, StatusDot |

## Migration policy

- **Create-first, replace-later** (unchanged from mobile rebuild design).
- Existing `SettingsNavRow` / `EditFieldModal` / chat cards stay until deliberate migration.
- Breaking change allowed for `Button` / `TextField`: remove required `palette` props in favor of theme context.

## Acceptance criteria

- [ ] `ThemeProvider` + `useUiTheme` exported; themed components work without per-call palette.
- [ ] App mounts kit provider; `MiniLoginScreen` builds without local palettes.
- [ ] `npm run storybook` launches Storybook via entry swap; light/dark toolbar works.
- [ ] Normal `expo start` / EAS builds unchanged (no Storybook in prod bundle).
- [ ] All §1–§6 components exist under `packages/ui` with at least one story each.
- [ ] README updated: ThemeProvider usage, Storybook scripts, inventory + deferred §7/§8.
- [ ] No bulk rewrite of settings/chat screens in this effort.

## Out of scope

- Chromatic / visual regression CI
- ThemeProvider owning themeId / persistence
- Moving App `src/lib/theme` presets wholesale into the kit
- Native iOS context menus / advanced sheet snap points libraries (may adopt later; first BottomSheet can be RN `Modal` + animated panel)

## References

- Kit policy: `packages/ui/README.md`
- Rebuild design: `docs/superpowers/specs/2026-08-21-mobile-rebuild-design.md`
- Phase 0 plan: `docs/superpowers/plans/2026-08-21-phase0-tokens-ui-kit.md`
