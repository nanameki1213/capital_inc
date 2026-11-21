// @ts-check
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

// 実時間を使えるのは packages/app だけ（docs/coding-rules.md 4章）。
const noRealTime = [
  {
    object: "Date",
    property: "now",
    message: "実時間は packages/app だけで扱う（coding-rules 4章）。",
  },
  {
    object: "performance",
    property: "now",
    message: "実時間は packages/app だけで扱う（coding-rules 4章）。",
  },
];
const noMathRandom = {
  object: "Math",
  property: "random",
  message: "乱数はシード付きのものを ctx 経由で使う（coding-rules 4章）。",
};

export default tseslint.config(
  { ignores: ["**/node_modules/**", "**/dist/**", "coverage/**"] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    files: ["packages/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-restricted-properties": ["error", noMathRandom, ...noRealTime],
      "no-restricted-syntax": [
        "error",
        {
          selector: "NewExpression[callee.name='Date']",
          message: "実時間は packages/app だけで扱う（coding-rules 4章）。",
        },
      ],
    },
  },
  {
    files: ["packages/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-properties": ["error", noMathRandom],
      "no-restricted-syntax": "off",
    },
  },
  {
    // 設定ファイルなどは型情報なしで調べる。
    files: ["*.js", "*.mjs", "*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  prettier,
);
