import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"

import { PostMeta } from "../PostMeta"

const PostTitle = styled.h3`
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`

const Article = styled.article`
  margin-top: 2rem;
`

export const PostSnippit = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <Article key={node.fields.slug}>
      <header>
        <PostTitle>
          <Link to={`/${node.fields.sourceInstanceName}${node.fields.slug}`}>
            {title}
          </Link>
        </PostTitle>
        <PostMeta date={node.frontmatter.date} />
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: node.frontmatter.description || node.excerpt,
          }}
        />
      </section>
    </Article>
  )
}
