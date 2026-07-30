/**
 * Metro — default Expo config.
 * `@minibot/client` resolves from node_modules (GitHub Packages alias).
 */
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;
