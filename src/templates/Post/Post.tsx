import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"

import Layout from "../../components/Layout"
import { SEO } from "../../components/SEO"
import Basic from "../Basic"

const Title = styled.h2`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`

interface PostProps {
  data: any
}

export default (props: any) => {
  const {
    data: { markdownRemark: post },
  } = props
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Basic title={post.frontmatter.title}>
        <article>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </Basic>
    </Layout>
  )
}

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
