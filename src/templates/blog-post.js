import React from "react"
import { Link, graphql } from "gatsby"

import { Layout } from "../components/layout"
import { SEO } from "../components/seo"

export const BlogPostTemplate = ({
  markdownRemark: post,
  data,
  title: siteTitle,
  location,
}) => (
  <Layout location={location} title={siteTitle}>
    <SEO
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
    <article>
      <header>
        <h1>{post.frontmatter.title}</h1>
        <p>{post.frontmatter.date}</p>
      </header>
      <section dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  </Layout>
)

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
