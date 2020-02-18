import React from "react"
import { Link } from "gatsby"

import { PostMeta } from "../PostMeta"

export const PostSnippit = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <article key={node.fields.slug}>
      <header>
        <h3>
          <Link to={`/blog${node.fields.slug}`}>{title}</Link>
        </h3>
        <PostMeta date={node.frontmatter.date} />
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
