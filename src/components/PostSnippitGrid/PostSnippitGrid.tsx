import React from "react"
import styled from "@emotion/styled"
import { PostSnippitItem } from "./PostSnippitItem"
import { Post } from "./types"
import { BREAKPOINTS } from "~styles"

interface PostSnippitGridProps {
  title?: string
  posts: Post[]
}

export const PostSnippitGrid: React.FC<PostSnippitGridProps> = ({
  posts,
  title,
}) => {
  return (
    <div>
      {title && <h2>{title}</h2>}
      {posts.map((post) => (
        <PostSnippitItem key={post?.node?.fields?.slug || ""} post={post} />
      ))}
    </div>
  )
}
