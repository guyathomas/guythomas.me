import React from "react"
import styled from "@emotion/styled"
import PageTransition from "gatsby-plugin-page-transitions"
import { Header } from "~components/Header"
import { COLOR_PALETTE } from "~styles"
import { GlobalStyles } from "./GlobalStyles"
import { ThemeProvider } from "./ThemeProvider"

interface GlobalLayoutProps {
  children: React.ReactNode
}

const ContentWrapper = styled.div`
  transition: background-color 1s;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  /* TODO: Just hard code header height for now. Calculate properly later */
  min-height: calc(100vh - 112px);
  /* This stops the collapsing margins creating a gap between the header and content */
  overflow-y: hidden;
`

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Header />
      <PageTransition>
        <ContentWrapper>{children}</ContentWrapper>
      </PageTransition>
    </ThemeProvider>
  )
}
