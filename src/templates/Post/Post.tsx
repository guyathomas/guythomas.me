import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~styles"
import { App } from "../App"

interface PostProps {
  children: React.ReactNode
  title: string
}

const PostWrapper = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
  padding: 1rem;
  padding-top: 0;
`

const PageTitle = styled.h1`
  font-weight: 500;
`

export const Post: React.FC<PostProps> = ({ title, children }) => (
  <App>
    <PostWrapper>
      <PageTitle>{title}</PageTitle>
      {children}
    </PostWrapper>
  </App>
)
