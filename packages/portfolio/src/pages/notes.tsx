import React from "react"
import { Page } from "~templates"
import { graphql } from "gatsby"
import { SummaryList } from "@guythomas.me/common/components/SummaryList"
import { NotesIndexQuery } from "~types/gatsby-graphql"

interface NotesProps {
  data: NotesIndexQuery
}

const Notes: React.FC<NotesProps> = (props) => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <Page title="Notes">
      <SummaryList posts={posts} />
    </Page>
  )
}

export default Notes

export const pageQuery = graphql`
  query NotesIndex {
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
