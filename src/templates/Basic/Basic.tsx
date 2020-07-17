import React from "react"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~constants"

interface BasicProps {
  children: React.ReactNode
  title: string
}

const BasicWrapper = styled.div`
  max-width: ${BREAKPOINTS.lg}px;
  margin: auto;
`

export const Basic: React.FC<BasicProps> = ({ title, children }) => (
  <BasicWrapper>
    <h1>{title}</h1>
    {children}
  </BasicWrapper>
)
