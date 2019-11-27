import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"

import { Layout } from "../components/Layout"
import { SEO } from "../components/Seo"
import { Bio } from "../components/Bio"
import { SocialLine } from "../components/SocialLine"
import { PostMeta } from "../components/PostMeta"

const BlogTitle = styled.h2`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`

export default ({ data: { markdownRemark: post, data, title: siteTitle, location }, ...rest}) => {
  return (
    <Layout mobileProps={{ startExpanded: true }}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
        <Bio small/>
        <SocialLine />
      <article>
        <header>
          <BlogTitle>{post.frontmatter.title}</BlogTitle>
          <PostMeta date={post.frontmatter.date} />
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
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
