/**
 * Metro — default Expo config.
 * `@minibot/client` resolves from node_modules (GitHub Packages alias).
 * `@mini-auth/auth-rn` resolves from the local frontend workspace during development.
 */
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.watchFolders = [
  path.resolve(__dirname, "../mini-auth/frontend/packages/auth-rn"),
  path.resolve(__dirname, "../minibot/packages/minibot-client"),
  path.resolve(__dirname, "packages/ui"),
];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@mini-auth/auth-rn": path.resolve(__dirname, "../mini-auth/frontend/packages/auth-rn/src"),
  "@minibot/ui": path.resolve(__dirname, "packages/ui/src"),
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
};

module.exports = config;
