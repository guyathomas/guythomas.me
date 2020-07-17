import React from "react"
import { Link } from "~components/Link"
import styled from "@emotion/styled"

interface PostSnippitItemProps {
  node: any
}

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
  /* font-weight: 400; */
`

const Time = styled.time`
  text-transform: uppercase;
  font-size: 0.8rem;
`

export const PostSnippitItem: React.FC<PostSnippitItemProps> = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug
  return (
    <div key={node.fields.slug}>
      <div>
        <Time>{node.frontmatter.date}</Time>
        <Title>
          <Link to={`/${node.fields.sourceInstanceName}${node.fields.slug}`}>
            {title}
          </Link>
        </Title>
      </div>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: node.frontmatter.description || node.excerpt,
          }}
        />
      </section>
    </div>
  )
}
