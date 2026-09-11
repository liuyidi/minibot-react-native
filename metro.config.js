/**
 * Metro — Expo default + Storybook + local `@minibot/ui` → src.
 *
 * Important: apply `resolveRequest` AFTER `withStorybook`, otherwise Storybook
 * replaces our resolver and `@minibot/ui` can pick up a nested `react`
 * (Invalid hook call / useMemo of null).
 */
const {
  withStorybook,
} = require("@storybook/react-native/withStorybook");

const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const uiRoot = path.resolve(projectRoot, "packages/ui");
const rootNodeModules = path.resolve(projectRoot, "node_modules");
const rootReact = path.resolve(rootNodeModules, "react");
const rootReactNative = path.resolve(rootNodeModules, "react-native");
const rootReactDom = path.resolve(rootNodeModules, "react-dom");

/** Peer / native packages that must resolve from the app root (not packages/ui). */
const ROOT_SINGLETONS = [
  "@react-native-community/slider",
  "lucide-react-native",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-root-siblings",
  "react-native-safe-area-context",
  "react-native-svg",
  "react-native-worklets",
];

/**
 * @param {string} moduleName
 * @returns {string | null}
 */
function resolveFromProjectRoot(moduleName) {
  try {
    return require.resolve(moduleName, { paths: [projectRoot] });
  } catch {
    return null;
  }
}

const shortPathMap = require(path.join(
  uiRoot,
  "scripts/short-path-map.json",
));
const babelAliases = require(path.join(
  uiRoot,
  "scripts/babel-aliases.json",
));

/** @type {import('expo/metro-config').MetroConfig} */
const baseConfig = getDefaultConfig(projectRoot);
baseConfig.watchFolders = [...(baseConfig.watchFolders ?? []), uiRoot];
baseConfig.resolver.unstable_enablePackageExports = true;

/**
 * @param {string} libName e.g. button | radio-group
 * @returns {string | null} path relative to ui package root
 */
function resolveLibToSrc(libName) {
  const meta = babelAliases[libName];
  const short =
    typeof meta === "string" ? meta : meta?.short ? meta.short : libName;
  return shortPathMap[short] ?? null;
}

const config = withStorybook(baseConfig, {
  enabled: process.env.STORYBOOK_ENABLED === "true",
});

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Pin singleton React / RN — never use packages/ui/node_modules/react.
  if (moduleName === "react") {
    return { filePath: path.join(rootReact, "index.js"), type: "sourceFile" };
  }
  if (moduleName === "react/jsx-runtime") {
    return {
      filePath: path.join(rootReact, "jsx-runtime.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react/jsx-dev-runtime") {
    return {
      filePath: path.join(rootReact, "jsx-dev-runtime.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react-dom") {
    return {
      filePath: path.join(rootReactDom, "index.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "react-native") {
    return {
      filePath: path.join(rootReactNative, "index.js"),
      type: "sourceFile",
    };
  }

  for (const pkg of ROOT_SINGLETONS) {
    if (moduleName === pkg || moduleName.startsWith(`${pkg}/`)) {
      const filePath = resolveFromProjectRoot(moduleName);
      if (filePath) {
        return { filePath, type: "sourceFile" };
      }
    }
  }

  if (moduleName === "@minibot/ui") {
    return {
      filePath: path.resolve(uiRoot, "src/index.ts"),
      type: "sourceFile",
    };
  }
  if (moduleName.startsWith("@minibot/ui/lib/")) {
    const libName = moduleName.slice("@minibot/ui/lib/".length);
    const src = resolveLibToSrc(libName);
    if (src) {
      return {
        filePath: path.resolve(uiRoot, src),
        type: "sourceFile",
      };
    }
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
