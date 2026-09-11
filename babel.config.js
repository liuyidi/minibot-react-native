module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // import { Button } from "@minibot/ui" → import { Button } from "@minibot/ui/lib/button"
      // Named import required: Metro maps lib/<alias> → src barrel (e.g. theme/index),
      // whose default is often ThemeProvider/ConfigProvider — default import would
      // bind brandLight/useUiTheme/etc. to the wrong export.
      [
        "import",
        {
          libraryName: "@minibot/ui",
          transformToDefaultImport: false,
        },
        "@minibot/ui",
      ],
    ],
  };
};
