import React from "react"
import { SummaryItem } from "./SummaryItem"
import { Post } from "./types"

interface SummaryListProps {
  title?: string
  posts: Post[]
}

export const SummaryList: React.FC<SummaryListProps> = ({ posts, title }) => {
  return (
    <>
      {title && <h2>{title}</h2>}
      {posts.map(({ node: { excerpt, fields, frontmatter } }) => (
        <SummaryItem
          key={fields?.slug || ""}
          title={frontmatter?.title || fields?.slug || ""}
          link={`/${fields?.sourceInstanceName || ""}${fields?.slug || ""}`}
          body={frontmatter?.description || excerpt || ""}
          time={frontmatter?.date}
        />
      ))}
    </>
  )
}
