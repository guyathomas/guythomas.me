import React from "react"
import { Page } from "~templates"
import { graphql } from "gatsby"
import { SummaryList } from "@guythomas.me/common/components/SummaryList"
import { BlogIndexQuery } from "~types/gatsby-graphql"

interface BlogProps {
  data: BlogIndexQuery
}

const Blog: React.FC<BlogProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  return (
    <Page title="Blog">
      <SummaryList posts={posts} />
    </Page>
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
