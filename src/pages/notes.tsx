import React from "react"
import { Basic, GlobalLayout } from "~templates"
import { graphql } from "gatsby"
import { PostSnippitGrid } from "~components/PostSnippitGrid"
import { NotesIndexQuery } from "~types/gatsby-graphql"

interface NotesProps {
  data: NotesIndexQuery
}

const Notes: React.FC<NotesProps> = (props) => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <GlobalLayout>
      <Basic title="Notes">
        <PostSnippitGrid posts={posts} />
      </Basic>
    </GlobalLayout>
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