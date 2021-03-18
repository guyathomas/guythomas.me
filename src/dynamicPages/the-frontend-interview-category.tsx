import React from "react"
import { graphql, Link } from "gatsby"

import { Page, App } from "~templates"
// import { SEO } from "~components/SEO"
import { SitePageContext, QuestionByCategoryQuery } from "~types/gatsby-graphql"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~styles"

interface TheFrontendInterviewCategoryProps {
  data: QuestionByCategoryQuery
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

const TheFrontendInterviewCategory: React.FC<TheFrontendInterviewCategoryProps> = ({
  data,
  pageContext,
}) => {
  return (
    <Page title={pageContext.section.title}>
      <Article>
        <p>{pageContext.section.description}</p>
        {data.allMarkdownRemark.nodes.map((node) => (
          <div>
            <Link
              to={`/the-frontend-interview/question-bank/${node.frontmatter.slug}`}
            >
              <h2>{node.frontmatter.title}</h2>
            </Link>
            <p>{node.frontmatter.description}</p>
          </div>
        ))}
      </Article>
    </Page>
  )
}

export default TheFrontendInterviewCategory

export const pageQuery = graphql`
  query QuestionByCategory($category: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "the-frontend-interview" } }
        frontmatter: { category: { eq: $category } }
      }
    ) {
      nodes {
        fields {
          sourceInstanceName
        }
        frontmatter {
          title
          category
          description
          slug
        }
      }
    }
  }
`
