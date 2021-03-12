import React from "react"
import { Link } from "~components/Link"
import styled from "@emotion/styled"
import { Post } from "./types"
import { BREAKPOINTS } from "~styles"

interface PostSnippitItemProps {
  post: Post
}

const Heading = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
`

const Time = styled.time`
  text-transform: uppercase;
  font-size: 0.8rem;
`

const Snippet = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
`

export const PostSnippitItem: React.FC<PostSnippitItemProps> = ({
  post: { node },
}) => {
  const heading = node.frontmatter?.title || node?.fields?.slug
  const to = `/${node?.fields?.sourceInstanceName || ""}${
    node?.fields?.slug || ""
  }`
  return (
    <Snippet key={node?.fields?.slug || ""}>
      <div>
        <Time>{node?.frontmatter?.date}</Time>
        <Heading>
          <Link to={to}>{heading}</Link>
        </Heading>
      </div>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: node?.frontmatter?.description || node.excerpt || "",
          }}
        />
      </section>
    </Snippet>
  )
}
