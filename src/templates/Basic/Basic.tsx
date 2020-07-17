import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~styles"

interface BasicProps {
  children: React.ReactNode
  title: string
}

const BasicWrapper = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
  padding: 1rem;
  padding-top: 0;
`

const PageTitle = styled.h1`
  font-weight: 500;
`

export const Basic: React.FC<BasicProps> = ({ title, children }) => (
  <BasicWrapper>
    <PageTitle>{title}</PageTitle>
    {children}
  </BasicWrapper>
)
