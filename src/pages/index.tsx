import React from "react"
import { graphql } from "gatsby"

import { PostSnippitGrid } from "~components/PostSnippitGrid"
import { Hero, App } from "~templates"
import { PageIndexQuery } from "~types/gatsby-graphql"

interface IndexProps {
  data: PageIndexQuery
}

const Index: React.FC<IndexProps> = (props) => {
  const recentPosts = props.data.recent.edges
  return (
    <App>
      <Hero>
        <PostSnippitGrid title="Recent Posts" posts={recentPosts} />
      </Hero>
    </App>
  )
}

export default Index

export const pageQuery = graphql`
  query PageIndex {
    site {
      siteMetadata {
        title
      }
    }
    recent: allMarkdownRemark(
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
