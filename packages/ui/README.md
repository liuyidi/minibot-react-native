# @minibot/ui — Mini React Native kit

Consumed by the Expo app via `"@minibot/ui": "file:./packages/ui"`.  
Token SoT: [mini-design-system](https://github.com/liuyidi/mini-design-system).

## Policy

- **Create-first, replace-later** — new screens import from here; do not mass-migrate `src/components` yet.
- No Expo Router, Gateway, auth, or lucide — icons via `ReactNode` slots.
- Colors from **`ThemeProvider`** (`useUiTheme` / `useResolvedTheme`); optional per-component `theme` override.
- **Chat / devices domain (§7–§8)** deferred.

## Theme

```tsx
import { ThemeProvider, Button, brandLight } from "@minibot/ui";

<ThemeProvider theme={brandLight}>
  <Button label="Continue" onPress={() => {}} />
</ThemeProvider>
```

App wires `AppearanceProvider` → `toUiTheme(palette)` → kit `ThemeProvider` in `src/app/_layout.tsx`.

## Storybook (entry swap)

```bash
npm run storybook          # STORYBOOK_ENABLED=true expo start
npm run storybook:ios
npm run storybook:android
```

When `STORYBOOK_ENABLED` is unset, the normal app entry runs and Storybook is stripped.  
Preview toolbar toggles brand light / dark.

## Inventory (§1–§6)

| Section | Components |
|---------|------------|
| Theme | ThemeProvider, useUiTheme, useResolvedTheme, brandLight/Dark |
| Foundation | Text, Button, IconButton, TextField, TextArea, Card, Divider, Spinner, Skeleton, Badge, Avatar, Chip |
| Controls | Switch, Checkbox, Radio/RadioGroup, SegmentedControl, Slider, ProgressBar |
| Lists | ListGroup, ListRow, SearchBar, EmptyState, Tabs |
| Overlays | Backdrop, Dialog, **BottomSheet**, ActionSheet, ToastProvider/useToast, Banner |
| Forms | FormField, OTPInput, PasswordField, PickerRow |
| Chrome | Screen, StackHeader, FAB |

Deferred: ChatBubble, ChatComposer, ApprovalCard, DeviceRow, SessionRow, …
