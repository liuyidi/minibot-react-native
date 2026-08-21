# Deferred: Login layout Android / iOS polish

> Tracked from rebuild spec. **Do not start until Phase 1 Chat MVP is accepted** (or product explicitly prioritizes auth screenshots).

**Goal:** Fine-tune `MiniLoginScreen` (and related auth chrome) so Android and iOS match Direction 02 / mini-auth web more closely without blocking chat work.

**Out of scope for this slice:** New IdPs (WeChat / phone); rewriting OAuth to native SDKs.

## Checklist

- [ ] Side-by-side pass on real Android + iOS devices (or simulators): safe area, keyboard, brand/headline spacing
- [ ] Align control height / type size / gaps to web login mobile rules where RN allows
- [ ] Provider row: press/loading/disabled consistent; no overlay “暂未接入” regressions
- [ ] Language switcher position vs status bar / notches
- [ ] Smoke: email OTP + Demo still work after layout-only changes

## Primary files

- `src/components/auth/MiniLoginScreen.tsx`
- `packages/ui/src/components/Button.tsx`
- `packages/ui/src/components/TextField.tsx`

## Spec pointer

See **Deferred backlog → Login layout polish** in  
`docs/superpowers/specs/2026-08-21-mobile-rebuild-design.md`.
