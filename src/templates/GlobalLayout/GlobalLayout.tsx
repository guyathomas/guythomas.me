import React from "react"
import PageTransition from "gatsby-plugin-page-transitions"

import { Header } from "~components/Header"
import { GlobalStyles } from "./GlobalStyles"

interface GlobalLayoutProps {
  children: React.ReactNode
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Header />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
