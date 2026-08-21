# Minibot React Native Rebuild — Design Spec

**Date:** 2026-08-21  
**Repos:** `minibot-react-native`, `mini-design-system`  
**Status:** Draft for review

## Goal

Rebuild the mobile client as a first-class Gateway client for [minibot](https://github.com/liuyidi/minibot), aligned with WebUI protocol and [mini-design-system](https://github.com/liuyidi/mini-design-system) Direction 02. Keep the Expo shell; rewrite auth / session / chat / theme cores in place under `src/`.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Strategy | Hybrid: keep Expo Router + `@minibot/client`; rewrite chat / session / theme / auth cores |
| Work tree | Edit in place under `src/` (no `src-next/` copy). Isolate via git branch/worktree if needed |
| Delivery | Sequential Phase 0 → 1 → 2 → 3 |
| Auth | Login UI; email/guest via mini-auth; default Gateway `https://bot.liuyidi.me` |
| Theme | Extract tokens; keep Claude/Codex presets; add brand (default) with **dark**; sync SoT to `mini-design-system` |
| Chat UI | Phase 1 GiftedChat; Phase 2 replace with Agent Timeline |
| Tabs | Short-term `Chat \| Me`; Knowledge / Discover **hide entries only, keep code**; Phase 3 expand toward WebUI hubs |
| Approach | Dual-repo: design-system SoT + RN consumption (not RN-first then backfill) |
| UI kit | New `packages/ui` (RN), analogous to `@minikb/ui`; design-system tokens; **add new components first, no rush to replace app screens** |

## Architecture

```text
mini-design-system
  tokens (brand light/dark + claude/codex presets)     ← SoT
        │
        ▼ DTCG JSON sync script
minibot-react-native/
  packages/ui          ← RN primitive kit (@minibot/ui), consumes tokens
  src/                 ← app shell, routes, gateway wiring
        │
        ├─ @mini-auth/auth-rn     email/guest → SecureStore
        └─ @minibot/client        bootstrap → Bearer REST + /ws multiplex
              │
              ▼
         bot.liuyidi.me Gateway
```

### Module boundaries (`src/`)

| Module | Owns | Does not own |
|--------|------|--------------|
| `lib/auth` + AuthContext | Login session, token storage, logout | Chat protocol |
| `MinibotClientContext` | Single `@minibot/client`, reconnect, connection status | Hand-rolled WS protocol |
| `hooks/sessions` + `wsTurn` | List / thread / `attach` / abort / stream merge | DeepSeek SSE as primary path |
| `lib/theme` | Resolve preset + light/dark → palette for app | Hardcoded colors in screens |
| `(tabs)/knowledge`, `discover` | Files retained; **not mounted** in Phase 1–2 | Product features until revived or replaced |

### Default connection

- Gateway base URL: `https://bot.liuyidi.me`
- Auth: existing email/guest login screens → session used for Gateway bootstrap / Bearer
- Secret / custom server: power-user / debug only, not the primary product path

## Phases & acceptance

### Phase 0 — Design tokens + `packages/ui` scaffold (parallel)

**mini-design-system**

- Extend brand tokens with formal **dark** values
- Promote Claude / Codex as first-class preset token files
- Keep DTCG JSON as SoT; update CSS / Direction 02 previews for dark + preset notes
- Update brand rules as needed for dark

**minibot-react-native**

- Sync tokens into RN theme layer (`src/lib/theme` + generated from JSON)
- Default preset: **brand**; settings still offer Claude / Codex
- Scaffold `packages/ui` (see below); add only **new** primitives as needed; do not mass-migrate screens yet

**Acceptance**

- Switch light/dark and brand/claude/codex without scattered hardcoded brand colors
- design-system preview and RN palette share the same token names/values
- `@minibot/ui` builds / typechecks; app can import a first primitive without breaking existing screens

### Phase 1 — Chat MVP (GiftedChat)

- Tabs: `Chat | Me` only (Knowledge / Discover routes unmounted, code kept)
- Login → Gateway bootstrap + streaming chat
- Sessions: list, create, open existing (**must call `ws.attach`**), delta stream, abort, connection badge / retry
- Settings: appearance (preset + dark), language, account; DeepSeek primary path removed from main UX (optional hidden debug only)
- New UI pieces (buttons, fields, etc.) go into `packages/ui` when introduced; existing GiftedChat screen can stay on current components until Phase 2

**Acceptance**

- Real device: login → new chat and reopen history both stream successfully
- Visible connection failure + retry; 401 returns to login

### Phase 2 — Agent basics (Agent Timeline)

- Replace GiftedChat with custom Agent Timeline
- Render reasoning, tool/progress, HITL approve/reject; session delete
- Models / runtime from Gateway `/api/settings*` (no local DeepSeek model list as source of truth)
- Prefer `@minibot/ui` for new timeline chrome (bubbles, approval cards, etc.)

**Acceptance**

- A tool-using turn shows progress and can be approved/rejected
- Model list matches Gateway / WebUI source

### Phase 3 — Near-WebUI shell

- Expand IA: Skills / Channels / Automations (tabs and/or Me entries), gated like WebUI `ui-entry`
- Decide fate of hidden Knowledge / Discover (reuse vs replace)
- One happy path each: install/browse skill, channel status, toggle/run automation

**Acceptance**

- Three hubs each complete one primary flow; polish secondary

### Out of scope (this rebuild program)

- Knowledge QA productization in Phase 1–2
- Full media / voice parity
- Desktop PKCE
- `/api/dev/*`
- Pixel-perfect WebUI clone
- Bulk rewrite of every existing screen onto `@minibot/ui` in Phase 0–1

## Theme / design-system sync

**SoT (`mini-design-system`)**

```text
tokens/
  mini-brand.tokens.json      # brand light + dark
  presets/
    claude.tokens.json
    codex.tokens.json
  mini-brand.tokens.css
  bridge.css                  # semantic bridge incl. dark
```

**RN consumption**

```text
src/lib/theme/
  tokens/generated/           # from DTCG JSON (script sync)
  presets/{brand,claude,codex}.ts
  resolveTheme(preset, mode) → ThemePalette (extend current types)
```

**Rules**

1. Change design-system first, then RN (never RN-only brand colors)
2. Semantic names (`canvas`, `ink`, `focus`, …); screens read `theme.colors.*`
3. Presets are full palette overlays; brand is default
4. Brand **must** ship dark; Claude/Codex should also ship dark (avoid half-broken appearance settings)
5. Short-term sync: script copy JSON → RN `generated/` (cross-repo; npm package optional later)
6. Do not port `@minikb/ui` (DOM) into RN; mirror **structure and token SoT** only

## `packages/ui` (RN kit, analogous to `@minikb/ui`)

**Purpose:** Incubating RN component kit for minibot mobile, same brand system as minikb’s web kit.

| | `@minikb/ui` (web) | `@minibot/ui` (this repo) |
|--|-------------------|---------------------------|
| Platform | React DOM + Tailwind / CSS vars | React Native |
| Tokens | CSS from mini-design-system | StyleSheet / theme object from same DTCG |
| Storybook | Yes (web) | Optional later; not required for Phase 0 |
| Consumption | `file:../packages/ui` in web app | Expo/Metro workspace or `file:./packages/ui` |

**Suggested layout**

```text
packages/ui/
  package.json                 # name: "@minibot/ui", private
  src/
    theme/                     # re-export or thin adapter over generated tokens
    components/                # Button, Text, Input, … as added
    index.ts
  README.md
```

**Adoption policy**

- **Create-first, replace-later:** new screens/features import from `@minibot/ui`
- Existing `src/components/*` stay until a deliberate migration (especially Phase 2 Timeline)
- Kit must not depend on Expo Router, Gateway, or auth — app wiring stays in `src/`
- Icons: Lucide RN, consistent with app

**Metro / workspace**

- Root `package.json` depends on `"@minibot/ui": "file:./packages/ui"` (or npm workspaces)
- Configure Metro `watchFolders` / monorepo resolution as needed for Expo 54

## Data flow (chat)

```text
Login (auth-rn)
  → SecureStore session
  → createClient({ baseUrl, getAuth }).bootstrap()
  → REST Bearer  |  WS /ws?token=
  → sessions.list / getThread / ws.attach
  → stream: delta → message → turn_end (abort supported)
  → UI: GiftedChat (P1) → Agent Timeline (P2)
```

**Errors:** bootstrap/WS failure → connection badge + retry; 401 → login. HITL in Phase 2.

## Testing strategy

- Unit: token resolve, session key normalize, `wsTurn` event merge
- Kit: lightweight tests for `@minibot/ui` primitives as they land
- Manual: real-device smoke per phase acceptance

## Open follow-ups (non-blocking)

- Exact mini-auth package publish vs sibling path alias for `@mini-auth/auth-rn`
- Whether Phase 3 uses bottom tabs or Me-nested hubs for Skills/Channels/Automations
- When to bump `@minibot/client` off pinned `0.1.0` to monorepo latest (RN already on local `file:../minibot/packages/minibot-client` during rebuild)

## Deferred backlog (do later — not Phase 1 blocking)

### Login layout polish — Android / iOS parity

**Status:** Deferred (2026-08-21). Login flow (email OTP, Demo, Google/GitHub AuthSession + native handoff) is in; **visual/layout fine-tuning across platforms comes later**.

**Why:** `MiniLoginScreen` Direction 02 shell is shared, but safe-area, keyboard, font metrics, and provider-button spacing still diverge between Android and iOS. OAuth sheet UX also differs (ASWebAuthenticationSession vs Custom Tabs) — product may keep international OAuth as secondary for CN Android.

**When:** After Phase 1 Chat MVP acceptance (streaming + attach), or a dedicated “auth polish” slice before store screenshots.

**Scope (later):**

- [ ] Audit login/register on physical Android + iOS: brand size, headline margins, field/control heights, language switcher inset, keyboard avoidance
- [ ] Align spacing to mini-auth web `web-login-page.css` mobile breakpoints where RN allows
- [ ] Provider buttons: loading/disabled states, hit targets, no platform-only clipping
- [ ] Optional: China-primary path notes (email OTP first; WeChat/phone later) — separate from layout polish
- [ ] Do **not** block session/chat work on pixel parity

**Files likely touched later:** `src/components/auth/MiniLoginScreen.tsx`, `@minibot/ui` `Button` / `TextField`, maybe platform-specific StyleSheet tweaks.

## References

- RN roadmap: `docs/minibot-mobile-roadmap.md`
- Gateway contract: minibot `docs/client-api.md`
- Design system: `mini-design-system/tokens/`, `rules/mini-brand-rules.md`
- Web kit analog: `minikb/packages/ui` (`@minikb/ui`)
- CLI auth precedence (reference only; mobile primary is email/guest): `minibot/packages/minibot-cli`
- Phase 0 plan: `docs/superpowers/plans/2026-08-21-phase0-tokens-ui-kit.md`
