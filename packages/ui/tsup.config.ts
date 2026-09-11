import { defineConfig } from "tsup";
import entries from "./scripts/entries.json" with { type: "json" };

const external = [
  "react",
  "react-native",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-svg",
  "react-native-worklets",
  "@react-native-community/slider",
  "lucide-react-native",
  /^@gorhom\//,
];

/** Force .js even for ESM so package.json exports stay stable. */
function outExtension() {
  return { js: ".js" };
}

/** @type {import('tsup').Options} */
const shared = {
  entry: entries,
  external,
  treeshake: true,
  splitting: false,
  outExtension,
  // Each entry is self-contained except peers — matches babel-plugin-import on-demand.
  bundle: true,
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.platform = "neutral";
  },
};

export default defineConfig([
  {
    ...shared,
    format: ["cjs"],
    outDir: "lib",
    clean: true,
    // Avoid pulling root TS 6 + expo baseUrl into dts; emit via tsc after JS build.
    dts: false,
  },
  {
    ...shared,
    format: ["esm"],
    outDir: "es",
    clean: false,
    dts: false,
  },
]);
