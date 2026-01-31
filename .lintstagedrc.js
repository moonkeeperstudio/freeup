module.exports = {
  // Run type-check on all TypeScript files
  "**/*.{ts,tsx}": () => "npm run type-check",

  // Run ESLint on TypeScript and JavaScript files
  "**/*.{js,jsx,ts,tsx}": ["eslint --fix"],

  // Run Prettier on all supported files
  "**/*.{js,jsx,ts,tsx,json,css,md,yml,yaml}": ["prettier --write"],
};
