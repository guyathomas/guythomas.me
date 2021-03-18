const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

const createPagesData = (edges = []) => {
  const PostTemplate = path.resolve(`./src/dynamicPages/post.tsx`)
  return edges.map((edge, index, edges) => {
    const previous = index === edges.length - 1 ? null : edges[index + 1].node
    const next = index === 0 ? null : edges[index - 1].node
    const path = `/${edge.node.fields.sourceInstanceName}${edge.node.fields.slug}`
    return {
      path,
      component: PostTemplate,
      context: {
        slug: edge.node.fields.slug,
        postPath: path,
        previous,
        next,
      },
    }
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
                category
                published
              }
            }
          }
        }
        allTheFrontendInterviewYaml {
          nodes {
            sections {
              slug
              title
              description
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }
  createPagesData(result.data.allMarkdownRemark.edges).forEach((pageData) => {
    createPage(pageData)
  })
}

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
