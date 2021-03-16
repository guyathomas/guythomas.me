const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

// Could use lodash in the future. Didn't want to `npm i lodash` just for this.
const groupBy = (collection, iteratee) =>
  collection.reduce((acc, item) => {
    const id = iteratee(item)
    const existingRecord = acc.get(id)
    if (!existingRecord) acc.set(id, [])
    return acc.set(id, [...acc.get(id), item])
  }, new Map())

const createPages = (createPage, edges = []) => {
  const PostTemplate = path.resolve(`./src/dynamicPages/post.tsx`)
  edges.forEach((post, index, edges) => {
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

  const groupedPosts = groupBy(
    result.data.allMarkdownRemark.edges,
    (edge) => edge.node.fields.sourceInstanceName
  )
  createPages(createPage, groupedPosts.blog)
  createPages(createPage, groupedPosts.nots)
  createPages(createPage, groupedPosts["the-frontend-interview"])
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
