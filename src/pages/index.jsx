import React from "react"

import { PostSnippit } from "components/PostSnippit"
import { SEO } from "components/Seo"
import { Bio } from "components/Bio"

export default props => {
  const posts = props.data.allMarkdownRemark.edges
  return (
    <>
      <SEO title="All posts" />
      <main>
        <Bio />
        {posts.map(post => (
          <PostSnippit key={post.node.fields.slug} {...post} />
        ))}
      </main>
    </>
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
