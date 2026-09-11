module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // import { Button } from "@minibot/ui" → import Button from "@minibot/ui/lib/button"
      ["import", { libraryName: "@minibot/ui" }, "@minibot/ui"],
    ],
  };
};
