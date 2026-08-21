# Minibot React Native

[简体中文](./README.md) | English

**Expo + React Native** mobile client for **Minibot**. The goal is to talk to the [minibot](https://github.com/liuyidi/minibot) FastAPI server (default `:8766`) and bring the desktop [webui](https://github.com/liuyidi/minibot/tree/main/webui) experience to iOS, Android, and Web.

> **Status**: App shell is usable. **Phase 1 connection layer** is wired via `@minibot/client` (bootstrap + REST + WS). Chat is minibot WS only (DeepSeek direct path removed) — see [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md).

## Positioning

| | |
|--|--|
| **Server** | Sibling repo **minibot** (FastAPI) — not a custom chat backend |
| **Desktop reference** | minibot `webui` (sessions, streaming, settings, agent protocol) |
| **This repo** | Native mobile implementation of the same product surface |

```text
┌─────────────────────┐     bootstrap / REST / WS      ┌──────────────────┐
│  minibot-react-native│ ─────────────────────────────► │  minibot :8766   │
│  (Expo / RN)         │ ◄───────────────────────────── │  agent + sessions │
└─────────────────────┘                                 └──────────────────┘
         ▲  UX / protocol reference
         │
┌─────────────────────┐
│  minibot/webui       │
│  (Vite React SPA)    │
└─────────────────────┘
```

## What’s available today

- **Cross-platform**: iOS / Android / Web (Expo Go or dev builds)
- **Three-tab nav**: Home, Chat, Settings (nested settings stack)
- **Chat UI**: `react-native-gifted-chat` with streaming, reasoning bubbles, Markdown
- **Theme & prefs**: appearance packs, light/dark, language
- **Auth**: mini-auth email OTP / Demo / OAuth; Gateway Bearer
- **Roadmap**: session UX and settings parity — [docs/TODO.md](./docs/TODO.md)

## Stack

| Area | Tech |
|------|------|
| Framework | Expo SDK 54, React Native 0.81 |
| Routing | Expo Router 6 |
| Chat UI | react-native-gifted-chat |
| Networking | `@minibot/client` (bootstrap / REST / WS) |
| Secure storage | expo-secure-store (auth token) |
| Language | TypeScript |

Target protocol (in progress): minibot `GET /webui/bootstrap`, Bearer REST, `/ws?token=`.

## Requirements

- **Node.js**: `>= 20.19.4` recommended (see `.nvmrc`)
- **Package manager**: npm
- **Device debugging**: [Expo Go](https://expo.dev/go) matching SDK 54
- **(Target) backend**: local or deployed [minibot](https://github.com/liuyidi/minibot) server

## Quick start

### 1. Clone & install

`@minibot/client` comes from GitHub Packages (published as `@liuyidi/minibot-client`):

```bash
git clone git@github.com:liuyidi/minibot-react-native.git
cd minibot-react-native

npm run setup:github-packages   # creates .env
# edit .env → NODE_AUTH_TOKEN=ghp_xxx (read:packages)
npm run install:deps
```

See [`docs/github-packages.md`](./docs/github-packages.md). Committed: `.npmrc` + `.env.example`. Real token stays in `.env` (gitignored).

Default gateway: `https://bot.liuyidi.me` (`app.json` → `extra.minibotBaseUrl`). Override under **Me → Minibot server** for local debug.

### 2. Start the dev server

```bash
npx expo start
```

- `i` — iOS simulator  
- `a` — Android emulator  
- `w` — Web  
- Scan QR — Expo Go on device  

```bash
npm run ios
npm run android
npm run web
```

### 3. Connect minibot and chat

1. After login (email OTP / Demo / OAuth), the default gateway is `https://bot.liuyidi.me`  
2. Local debug: run minibot locally; double-tap the version footer under About to open server settings and override Base URL  
3. Chat Tab only sends when the gateway is connected (WS `attach` / delta / abort)  

## Layout

```
index.tsx                    # Entry (gesture-handler + Expo Router → src/app)
src/
├── app/                     # Expo Router
│   ├── _layout.tsx          # Root layout & providers
│   ├── (auth)/              # Login / register
│   ├── (tabs)/
│   │   ├── index.tsx        # Chat
│   │   ├── knowledge.tsx
│   │   ├── discover.tsx
│   │   └── me.tsx           # Me tab home
│   └── settings/            # Settings detail screens (root stack, no tab bar)
├── components/              # Chat, settings, UI, navigation
├── context/                 # Auth / Appearance / Language / Minibot
├── hooks/
├── constants/
├── types/
└── lib/                     # Domains: minibot / auth / chat / settings / i18n / theme
docs/
├── minibot-mobile-roadmap.md
├── src-layout-plan.md       # Source layout contract (done)
└── TODO.md
assets/                      # Images / fonts (stay at repo root)
```

## Docs

| Doc | Purpose |
|-----|---------|
| [docs/minibot-mobile-roadmap.md](./docs/minibot-mobile-roadmap.md) | Gap analysis & phased plan vs minibot / webui |
| [docs/src-layout-plan.md](./docs/src-layout-plan.md) | Source layout under `src/` (done) |
| [docs/TODO.md](./docs/TODO.md) | TODO overview |
| [docs/app-release-china.md](./docs/app-release-china.md) | China store release (later) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run ios` / `android` / `web` | Platform runners |
| `npm run lint` | Lint |
| `npm test` | Tests |
| `npm run build:android:apk` | Android APK |

## Notes

- **Expo Go** must be SDK 54.  
- **iOS input**: GiftedChat needs `maxInputLength` (already set).  
- **minibot wiring**: follow roadmap Phase 1; chat requires a connected gateway (no local model fallback).

## Links

- [minibot](https://github.com/liuyidi/minibot) — server + webui  
- [Expo](https://docs.expo.dev/) · [React Native](https://reactnative.dev/)  
- [react-native-gifted-chat](https://github.com/FaridSafi/react-native-gifted-chat)

## Acknowledgments

Early shell forked from an open-source chat demo; the product is now the Minibot mobile client.

## License

MIT
