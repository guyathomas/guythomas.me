import React from "react"
import styled from "@emotion/styled"
import { App } from "../App"
import { BREAKPOINTS } from "~styles"
interface PostProps {
  children: React.ReactNode
  title: string
}

const PageTitle = styled.h1`
  font-weight: 500;
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
`

export const Post: React.FC<PostProps> = ({ title, children }) => (
  <App>
    <PageTitle>
      <h1>{title}</h1>
    </PageTitle>
    {children}
  </App>
)
