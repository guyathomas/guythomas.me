import React from "react"
import styled from "@emotion/styled"
import PageTransition from "gatsby-plugin-page-transitions"
import useDarkMode from "use-dark-mode"
import { Header } from "~components/Header"
import { COLOR_PALETTE } from "~styles"
import { GlobalStyles } from "./GlobalStyles"

interface GlobalLayoutProps {
  children: React.ReactNode
}

interface ThemeContextProps {
  isDarkMode: boolean
}
export const ThemeContext = React.createContext<ThemeContextProps>({
  isDarkMode: false,
})
const ContentWrapper = styled.div`
  transition: background-color 1s;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  /* TODO: Just hard code header height for now. Calculate properly later */
  min-height: calc(100vh - 112px);
`

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { value: isDarkMode } = useDarkMode(false)
  React.useEffect(() => {
    Object.values(COLOR_PALETTE).forEach((color) => {
      document.documentElement.style.setProperty(
        color.cssVariable,
        isDarkMode ? color.dark : color.light
      )
    })
  }, [isDarkMode])
  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      <GlobalStyles />
      <Header />
      <PageTransition>
        <ContentWrapper>{children}</ContentWrapper>
      </PageTransition>
    </ThemeContext.Provider>
  )
}
