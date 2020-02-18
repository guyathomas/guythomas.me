import React from "react"

export const PostMeta = ({ date, category }) => (
  <h4>
    <span>{date}</span>
    {category && <span> - {category}</span>}
  </h4>
)
