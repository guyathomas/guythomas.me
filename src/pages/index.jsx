import React from "react"

import { PostSnippit } from "../components/PostSnippit"
import { Bio } from "../components/Bio"
import { SocialLine } from "../components/SocialLine"
import { SEO } from "../components/Seo"
import { Layout } from "../components/Layout"

export default props => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <Layout>
      {({ isMobile }) =>
        isMobile ? (
          <>
            <SEO title="All posts" />
            <Bio />
            <SocialLine />
            <main>
              {posts.map(post => (
                <PostSnippit key={post.node.fields.slug} {...post} />
              ))}
            </main>
          </>
        ) : (
          <>
            <SEO title="All posts" />
            <main>
              {posts.map(post => (
                <PostSnippit key={post.node.fields.slug} {...post} />
              ))}
              <SocialLine orientation="vertical"/>
            </main>
          </>
        )
      }
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
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
