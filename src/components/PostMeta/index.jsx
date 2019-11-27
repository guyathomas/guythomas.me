import React from "react"
import styled from "@emotion/styled"

const MetaWrapper = styled.h4`
  margin: 0;
  margin-bottom: 0.2rem;
  font-weight: 500;
  font-size: 80%;
`

export const PostMeta = ({ date, category = 'Work' }) => (
  <MetaWrapper>
    <span>{date}</span>
    {true && <span> - {category}</span>}
  </MetaWrapper>
)
