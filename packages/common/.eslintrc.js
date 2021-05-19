module.exports = {
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["~styles", "./src/styles"],
          ["~components/*", "./src/components/*"],
          ["~context", "./src/context"],
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
}
