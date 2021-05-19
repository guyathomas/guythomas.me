module.exports = {
  settings: {
    "import/resolver": {
      alias: {
        map: [
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
}
