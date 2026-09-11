/**
 * Storybook entry (swapped in when STORYBOOK_ENABLED=true).
 *
 * Keep this as `index.ts` — @storybook/react-native resolves
 * `.rnstorybook/index` with extensions `js → jsx → ts → tsx`, so `.ts`
 * must exist or a stale Metro graph still pointing at `index.ts` will
 * throw "Failed to get the SHA-1".
 */
import "./entry";
