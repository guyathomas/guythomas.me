import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"

import Layout from "../../components/Layout"
import { LayoutContext } from "~contexts"

const Title = styled.h2`
  margin-top: 2.5rem;
  margin-bottom: 1rem;
`

interface PostProps {
  data: any
}

export const Post: React.FC<PostProps> = (props) => {
  // const {
  //   data: { markdownRemark: post },
  // } = props
  return (
    <Layout>
      {/* <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      /> */}
      <article>
        <header>{/* <Title>{post.frontmatter.title}</Title> */}</header>
        Body
        {/* <section dangerouslySetInnerHTML={{ __html: post.html }} /> */}
      </article>
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
