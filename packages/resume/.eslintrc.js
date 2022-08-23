module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    project: "tsconfig.json",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"],
    },
    "import/resolver": {
      alias: {
        map: [
          ["~actions", "./src/actions"],
          ["~styles", "./src/styles"],
          ["~components", "./src/components"],
          ["~context", "./src/context"],
          ["~templates", "./src/templates"],
          ["~types", "./src/types"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    "react/prop-types": 0,
  },
}
