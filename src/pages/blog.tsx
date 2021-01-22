import React from "react"
import { Post } from "~templates"
import { graphql } from "gatsby"
import { PostSnippitGrid } from "~components/PostSnippitGrid"

import { BlogIndexQuery } from "~types/gatsby-graphql"

interface BlogProps {
  data: BlogIndexQuery
}

const Blog: React.FC<BlogProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Post title="Blog">
      <PostSnippitGrid posts={posts} />
    </Post>
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
      filter: {
        fields: { sourceInstanceName: { eq: "blog" } }
        frontmatter: { published: { eq: true } }
      }
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
