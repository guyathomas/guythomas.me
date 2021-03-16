import React from "react"
import { graphql } from "gatsby"

import { Post } from "~templates"
import { SEO } from "~components/SEO"
import { PostBySlugQuery, SitePageContext } from "~types/gatsby-graphql"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~styles"
import "./post.css"
interface PostProps {
  data: PostBySlugQuery
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

const PostPage: React.FC<PostProps> = ({ data: { markdownRemark: post } }) => {
  return (
    <Post title={post?.frontmatter?.title || ""}>
      <SEO
        title={`${post?.frontmatter?.title || ""}`}
        description={post?.frontmatter?.description || post?.excerpt || ""}
      />
      <Article dangerouslySetInnerHTML={{ __html: post?.html || "" }} />
    </Post>
  )
}

export default PostPage

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
