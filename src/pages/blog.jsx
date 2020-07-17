import React from "react"
import Basic from "../templates/Basic"
import Layout from "../components/Layout"
import { PostSnippitGrid } from "../components/PostSnippitGrid"

export default (props) => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <Layout>
      <Basic title="Blog">
        <PostSnippitGrid posts={posts} />
      </Basic>
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
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fields: { sourceInstanceName: { eq: "blog" } } }
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
