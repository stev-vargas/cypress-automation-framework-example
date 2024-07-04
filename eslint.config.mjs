import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginCypress from "eslint-plugin-cypress/flat";
import prettierPlugin from "eslint-plugin-prettier";



export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      cypress: pluginCypress,
      prettier: prettierPlugin,
    },
    rules: {
      "comma-dangle": ["error", "always-multiline"],
      "no-debugger": "warn",
      "no-console": "off",
      "no-alert": "warn",
      "no-empty": "error",
      "no-extra-semi": "error",
      quotes: [2, "double", "avoid-escape"],
      semi: "error",
      curly: "error",
      "valid-jsdoc": "off",
      "space-unary-ops": "error",
      "block-scoped-var": "error",
      "consistent-return": "off",
      "dot-notation": "error",
      "one-var-declaration-per-line": "error",
      "no-trailing-spaces": "error",
      "constructor-super": "error",
      "no-var": "error",
      "import/no-named-as-default": "off",
      "no-prototype-builtins": "off",
      "no-case-declarations": "off",
      "no-useless-escape": "off",
      "max-lines": ["warn", { max: 750, skipBlankLines: true, skipComments: true }],
      "cypress/no-unnecessary-waiting": ["warn"],
      "cypress/unsafe-to-chain-command": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "off",
    },
  },
];