import React from "react"
import styled from '@emotion/styled'
import { Link, graphql } from "gatsby"

const PublishDate = styled.span`
  text-transform: uppercase;
`

const Category = styled.span`
  text-transform: pink;
  color: purple;
`

export const Post = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <article key={node.fields.slug}>
      <header>
        <h3>
          <Link to={node.fields.slug}>{title}</Link>
        </h3>
        <div>
        <PublishDate>{node.frontmatter.date}</PublishDate>
        <span> - </span>
        <Category>Work</Category>
      </div>
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: node.frontmatter.description || node.excerpt,
          }}
        />
      </section>
    </article>
  )
}
