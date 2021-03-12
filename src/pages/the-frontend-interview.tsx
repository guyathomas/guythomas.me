import React from "react"
import { Post } from "~templates"
import { graphql } from "gatsby"
import { PostSnippitGrid } from "~components/PostSnippitGrid"

import { TheFrontendInterviewQuery } from "~types/gatsby-graphql"

interface TheFrontendInterviewProps {
  data: TheFrontendInterviewQuery
}

const TheFrontendInterview: React.FC<TheFrontendInterviewProps> = ({
  data,
}) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Post title="The Frontend Interview">
      <PostSnippitGrid posts={posts} />
    </Post>
  )
}

export default TheFrontendInterview

export const pageQuery = graphql`
  query TheFrontendInterview {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { sourceInstanceName: { eq: "the-frontend-interview" } }
        frontmatter: { published: { eq: true } }
      }
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
