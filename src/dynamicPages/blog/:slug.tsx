import React from "react"
import { graphql } from "gatsby"

import { GlobalLayout, Basic } from "~templates"
import { SEO } from "~components/SEO"
import { PostBySlugQuery } from "~types/gatsby-graphql"

interface PostProps {
  data: PostBySlugQuery
}

const Post: React.FC<PostProps> = ({ data: { markdownRemark: post } }) => {
  return (
    <GlobalLayout>
      <SEO
        title={`${post?.frontmatter?.title || ""}`}
        description={post?.frontmatter?.description || post?.excerpt || ""}
      />
      <Basic title={post?.frontmatter?.title || ""}>
        <article>
          <section dangerouslySetInnerHTML={{ __html: post?.html || "" }} />
        </article>
      </Basic>
    </GlobalLayout>
  )
}

export default Post

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
