import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "@guythomas.me/common/styles"
import { App } from "../App"
interface PageProps {
  children: React.ReactNode
  title: string
}

const PageTitle = styled.h1`
  font-weight: 500;
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
`

export const Page: React.FC<PageProps> = ({ title, children }) => (
  <App>
    <PageTitle>
      <h1>{title}</h1>
    </PageTitle>
    {children}
  </App>
)
