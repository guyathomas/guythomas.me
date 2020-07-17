import React from "react"

import { PostSnippitGrid } from "~components/PostSnippitGrid"
import { Hero, GlobalLayout } from "~templates"

export default (props) => {
  const recentPosts = props.data.recent.edges
  return (
    <GlobalLayout>
      <Hero>
        <PostSnippitGrid title="Recent Posts" posts={recentPosts} />
      </Hero>
    </GlobalLayout>
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
      filter: { fields: { sourceInstanceName: { eq: "blog" } } }
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
