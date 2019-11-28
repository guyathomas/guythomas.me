import React from "react"
import styled from "@emotion/styled"

const MetaWrapper = styled.h4`
  margin: 0;
  margin-bottom: 0.2rem;
  font-weight: 500;
  font-size: 80%;
`

export const PostMeta = ({ date, category }) => (
  <MetaWrapper>
    <span>{date}</span>
    {category && <span> - {category}</span>}
  </MetaWrapper>
)
