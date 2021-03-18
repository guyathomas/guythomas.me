import React from "react"
import { SummaryItem } from "./SummaryItem"
import { Post } from "./types"

interface SummaryListProps {
  posts: Post[]
}

export const SummaryList: React.FC<SummaryListProps> = ({ posts }) => {
  return (
    <>
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
