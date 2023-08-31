const { createFilePath } = require("gatsby-source-filesystem")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const parent = getNode(node.parent)
    createNodeField({
      name: `slug`,
      node,
      value,
    })
    createNodeField({
      name: `sourceInstanceName`,
      node,
      value: parent.sourceInstanceName,
    })
  }
}

const getNewRules = (config) => config.module.rules.reduce(
  (acc, webpackModule) => {
    webpackModule?.use?.forEach &&
      webpackModule.use.forEach(({ loader, options }) => {
        if (
          loader?.includes("url-loader") ||
          loader?.includes("file-loader")
        ) {
          if (options) {
            const hashStrategy = "sha256"
            options.name = `static/[name]-[${hashStrategy}:hash].[ext]`
            options.hash = hashStrategy
          }
        }
      })

    // 2. Otherwise, rules stay unchanged
    return [...acc, webpackModule]
  },
  []
)

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {

  const originalConfig = getConfig()
  // TODO: Asset Modules is meant to replace file-loader. Explore replacing https://webpack.js.org/guides/asset-modules/
  originalConfig.module.rules = getNewRules(originalConfig) // md4 is used by default, and not supported
  actions.replaceWebpackConfig(originalConfig)

  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
    output: {
      hashFunction: "sha256",
    },
  })
}
