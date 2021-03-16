import React from "react"
import { Page } from "~templates"
import { graphql } from "gatsby"
import { SummaryList } from "~components/SummaryList"

import { TheFrontendInterviewQuery } from "~types/gatsby-graphql"

interface TheFrontendInterviewProps {
  data: TheFrontendInterviewQuery
}

const TheFrontendInterview: React.FC<TheFrontendInterviewProps> = ({
  data,
}) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Page title="The Frontend Interview">
      <SummaryList posts={posts} />
    </Page>
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
