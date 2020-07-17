import React from "react"

import { PostSnippitItem } from "./PostSnippitItem"

interface PostSnippitGridProps {
  title?: string
  posts: any[]
}

export const PostSnippitGrid: React.FC<PostSnippitGridProps> = ({
  posts,
  title,
}) => {
  return (
    <div>
      {title && <h2>{title}</h2>}
      {posts.map((post) => (
        <PostSnippitItem key={post.node.fields.slug} {...post} />
      ))}
    </div>
  )
}
