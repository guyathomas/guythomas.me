import React from "react"
import { graphql } from "gatsby"

import { Page, App } from "~templates"
import { PageBySlugQuery, SitePageContext } from "~types/gatsby-graphql"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "@guythomas.me/common/styles"
import "./post.css"
interface ArticlePageProps {
  data: PageBySlugQuery
  pageContext: SitePageContext
}

const Article = styled.article`
  display: grid;
  grid-template-columns: 1fr min(${BREAKPOINTS.md}px, 100%) 1fr;
  & > * {
    grid-column: 2;
  }
  & > .full-bleed + * {
    grid-column: 1/4;
  }
`

const ArticlePage: React.FC<ArticlePageProps> = ({
  data: { markdownRemark: post },
}) => (
  <Page title={post?.frontmatter?.title || ""}>
    <Article dangerouslySetInnerHTML={{ __html: post?.html || "" }} />
  </Page>
)

export default ArticlePage

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
