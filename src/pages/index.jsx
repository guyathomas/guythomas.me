import React from "react"

import { PostSnippitGrid } from "../components/PostSnippitGrid"
import Hero from "../templates/Hero"
import Layout from "../components/Layout"

export default (props) => {
  const recentPosts = props.data.recent.edges
  return (
    <Layout>
      <Hero>
        <PostSnippitGrid title="Recent Posts" posts={recentPosts} />
      </Hero>
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
    recent: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 2
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
            sourceInstanceName
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
