import React from "react"
import { Basic } from "../templates/Basic"
import { GlobalLayout } from "../templates/GlobalLayout"
import { PostSnippitGrid } from "../components/PostSnippitGrid"

export default (props) => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <GlobalLayout>
      <Basic title="Notes">
        <PostSnippitGrid posts={posts} />
      </Basic>
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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { sourceInstanceName: { eq: "notes" } } }
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
