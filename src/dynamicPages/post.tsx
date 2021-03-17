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

const PostPage: React.FC<PostProps> = ({
  pageContext: { slug },
  data: { markdownRemark: post },
}) => {
  // The slug returned here has a slash before and after the string we want, i.e. /some-slug/.
  // Lets get rid of these, but don't remove all slashes, since we may eventually want nested slugs
  // This will always exist, but default to make TS happy :)
  const cleanedSlug = slug?.slice(1, -1) || ""
  return (
    <Post title={post?.frontmatter?.title || ""}>
      <SEO
        title={`${post?.frontmatter?.title || ""}`}
        description={post?.frontmatter?.description || post?.excerpt || ""}
      />
      <Article dangerouslySetInnerHTML={{ __html: post?.html || "" }} />
      {/* <Comments slug={cleanedSlug} /> */}
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
