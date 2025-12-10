import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // Enforce the Rules of Hooks
      "react-hooks/rules-of-hooks": "error",
      // Verify the list of dependencies for Hooks like useEffect
      "react-hooks/exhaustive-deps": "warn",
      ...reactHooks.configs.recommended.rules,
      // Disable purity rule to allow intentional Date.now()/perf counters in render helpers
      "react-hooks/purity": "off",
      // Disable strict ref access rules (allow ref access during render for store initialization)
      "react-hooks/refs": "off",
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
