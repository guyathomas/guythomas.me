import React from "react"
import { WrapPageElementNodeArgs } from "gatsby"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~constants"
import PageTransition from "gatsby-plugin-page-transitions"

import { Header } from "../Header"
import { GlobalStyles } from "./GlobalStyles"

const ContentContainer = styled.div`
  padding: 1rem;
  padding-top: 0;
`

export const Layout: React.FC<WrapPageElementNodeArgs> = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Header />
      <PageTransition>
        <ContentContainer>{children}</ContentContainer>
      </PageTransition>
    </>
  )
}
