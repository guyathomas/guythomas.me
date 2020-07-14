import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"

import { SEO } from "../components/Seo"
import { PostMeta } from "../components/PostMeta"

const Title = styled.h2`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`

export default ({ data: { markdownRemark: post } }) => (
  <>
    <SEO
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
    <article>
      <header>
        <Title>{post.frontmatter.title}</Title>
        <PostMeta date={post.frontmatter.date} />
      </header>
      <section dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  </>
)

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
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
