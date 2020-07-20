import React from "react"
import { Basic, GlobalLayout } from "~templates"
import { graphql } from "gatsby"
import { PostSnippitGrid } from "~components/PostSnippitGrid"

import { BlogIndexQuery } from "~types/gatsby-graphql"

interface BlogProps {
  data: BlogIndexQuery
}

const Blog: React.FC<BlogProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <GlobalLayout>
      <Basic title="Blog">
        <PostSnippitGrid posts={posts} />
      </Basic>
    </GlobalLayout>
  )
}

export default Blog

export const pageQuery = graphql`
  query BlogIndex {
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
