import React from "react"

import { PostSnippit } from "../components/PostSnippit"
import { SEO } from "../components/Seo"
import { Layout } from "../components/Layout"

export default ({ focusMode = false, ...props }) => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <Layout focusMode={focusMode}>
      <SEO title="All posts" />
      <main>
        {posts.map(post => (
          <PostSnippit key={post.node.fields.slug} {...post} />
        ))}
      </main>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
