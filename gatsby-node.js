const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const createPages = (createPage, allEdges, name) => {
  allEdges
    .filter(edge => edge.node.fields.sourceInstanceName === name)
    .forEach((post, index, edges) => {
      const previous = index === edges.length - 1 ? null : edges[index + 1].node
      const next = index === 0 ? null : edges[index - 1].node
      const path = `/${name}${post.node.fields.slug}`
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

  const PostTemplate = path.resolve(`./src/templates/post.js`)
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

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions
  if (page.path.match(new RegExp(/^\/resume\//))) {
    page.context.layout = "vanillaLayout"
    createPage(page)
  }
}
