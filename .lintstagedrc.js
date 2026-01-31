module.exports = {
  // Run type-check, ESLint, and tests on TypeScript files
  "**/*.{ts,tsx}": (filenames) => [
    "npm run type-check",
    `eslint --fix ${filenames.join(" ")}`,
    "npm test",
  ],

  // Run ESLint on JavaScript files
  "**/*.{js,jsx}": ["eslint --fix"],

  // Run Prettier on all supported files
  "**/*.{js,jsx,ts,tsx,json,css,md,yml,yaml}": ["prettier --write"],
};
