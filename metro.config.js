/**
 * Metro — default Expo config.
 * Private packages resolve from node_modules (GitHub Packages alias).
 */
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.watchFolders = [path.resolve(__dirname, "packages/ui")];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "@minibot/ui": path.resolve(__dirname, "packages/ui/src"),
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
};

module.exports = config;
