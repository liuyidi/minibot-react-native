# @minibot/ui — incubating Mini React Native kit (Direction 02)

Consumed by the Expo app via `"@minibot/ui": "file:./packages/ui"`.
Token SoT: [mini-design-system](https://github.com/liuyidi/mini-design-system).
Web analog: `@minikb/ui` in `minikb/packages/ui`.

## Policy

- **Create-first, replace-later** — new screens import from here; do not mass-migrate `src/components` yet.
- No Expo Router, Gateway, or auth dependencies.
- Colors come from a `palette` prop (or a future ThemeProvider), not hardcoded brand hex in components.

## Usage

```tsx
import { Button, TextField } from "@minibot/ui";

<Button
  label="Continue"
  variant="primary"
  palette={{ primary: "#080808", onPrimary: "#ffffff", surface: "#f5f5f5", text: "#080808", border: "#dedede" }}
  onPress={() => {}}
/>

<TextField
  label="Email"
  palette={{ ink: "#080808", canvas: "#ffffff", border: "#a8a8a8", focus: "#4f46e5", muted: "#666666" }}
  value={email}
  onChangeText={setEmail}
/>
```
