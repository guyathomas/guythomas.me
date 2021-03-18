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
  edges.forEach((edge, index, edges) => {
    const previous = index === edges.length - 1 ? null : edges[index + 1].node
    const next = index === 0 ? null : edges[index - 1].node
    const path = `/${edge.node.fields.sourceInstanceName}${edge.node.fields.slug}`
    createPage({
      path,
      component: PostTemplate,
      context: {
        slug: edge.node.fields.slug,
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

  const groupedPosts = groupBy(
    result.data.allMarkdownRemark.edges,
    (edge) => edge.node.fields.sourceInstanceName
  )
  const questionCategories = new Map(
    result.data.allTheFrontendInterviewYaml.nodes[0].sections.map((section) => [
      section.slug,
      section,
    ])
  )
  // Make sure that the questions in the question bank will have a category page for it
  groupedPosts.get("the-frontend-interview").forEach((edge) => {
    const { category, published } = edge.node.frontmatter
    if (published && !questionCategories.get(category)) {
      console.error(`Category ${category} does not have a corresponding page`)
    }
  })

  const QuestionTemplate = path.resolve(
    `./src/dynamicPages/the-frontend-interview-category.tsx`
  )

  questionCategories.forEach((section, category) => {
    const path = `/the-frontend-interview/${category}`
    createPage({
      path,
      component: QuestionTemplate,
      context: {
        category,
        section,
      },
    })
  })

  createPages(createPage, groupedPosts.get("blog"))
  createPages(createPage, groupedPosts.get("notes"))
  createPages(createPage, groupedPosts.get("the-frontend-interview"))
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
