const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const createPages = (createPage, allEdges, name) => {
  const PostTemplate = path.resolve(`./src/dynamicPages/blog/[slug].tsx`)
  allEdges
    .filter((edge) => edge.node.fields.sourceInstanceName === name)
    .forEach((post, index, edges) => {
      const previous = index === edges.length - 1 ? null : edges[index + 1].node
      const next = index === 0 ? null : edges[index - 1].node
      const path = `/${post.node.fields.sourceInstanceName}${post.node.fields.slug}`
      createPage({
        path,
        component: PostTemplate,
        context: {
          slug: post.node.fields.slug,
          postPath: path,
          previous,
          next,
        },
      })
    })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
                sourceInstanceName
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges
  createPages(createPage, posts, "blog")
  createPages(createPage, posts, "notes")
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
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
