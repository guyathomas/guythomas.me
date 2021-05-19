import React from "react"
import { graphql } from "gatsby"

import { SummaryList } from "@guythomas.me/common/components/SummaryList"
import { App } from "~templates"
import { Hero } from "@guythomas.me/common/components/Hero"
import { PageIndexQuery } from "~types/gatsby-graphql"
import { BREAKPOINTS } from "@guythomas.me/common/styles"
import styled from "@emotion/styled"

interface IndexProps {
  data: PageIndexQuery
}

const PageTitle = styled.h1`
  font-weight: 500;
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
`

const Index: React.FC<IndexProps> = (props) => {
  const recentPosts = props.data.recent.edges
  return (
    <App>
      <Hero />
      <PageTitle>
        <h1>Recent Posts</h1>
      </PageTitle>
      <SummaryList posts={recentPosts} />
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
