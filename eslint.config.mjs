import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["node_modules", "dist", "cache", ".tools"],
  },
  {
    files: ["site/assets/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        location: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        setTimeout: "readonly",
        addEventListener: "readonly",
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
