import React from "react"
import { WrapPageElementNodeArgs } from "gatsby"
import PageTransition from "gatsby-plugin-page-transitions"

import { Header } from "../Header"
import { GlobalStyles } from "./GlobalStyles"

export const Layout: React.FC<WrapPageElementNodeArgs> = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Header />
      <PageTransition>{children}</PageTransition>
    </>
  )
}
