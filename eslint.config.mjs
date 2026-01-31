import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  // Global ignores must come first
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
