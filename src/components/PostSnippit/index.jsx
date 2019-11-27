import React from "react"
import styled from "@emotion/styled"
import { Link, graphql } from "gatsby"

const PublishDate = styled.span`
  text-transform: uppercase;
`

const Category = styled.span`
  text-transform: pink;
  color: purple;
`

const PostTitle = styled.h3`
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`

const PostMeta = styled.h4`
  margin: 0;
  margin-bottom: 0.2rem;
  font-weight: 500;
  font-size: 80%;
`;

const Article = styled.article`
  margin-top: 2rem;
`

export const PostSnippit = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <Article key={node.fields.slug}>
      <header>

        <PostTitle>
          <Link to={node.fields.slug}>{title}</Link>
        </PostTitle>
        <PostMeta>
          <PublishDate>{node.frontmatter.date}</PublishDate>
          <span> - </span>
          <Category>Work</Category>
        </PostMeta>
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
