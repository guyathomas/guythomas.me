const { createFilePath } = require(`gatsby-source-filesystem`)
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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}
