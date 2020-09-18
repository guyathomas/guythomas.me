import React from "react"
import styled from "@emotion/styled"
import PageTransition from "gatsby-plugin-page-transitions"
import { Header } from "~components/Header"
import { Menu } from "~components/Menu"
import { PageSizeProvider } from "~context/PageSize"
import { COLOR_PALETTE, BREAKPOINTS } from "~styles"
import { GlobalStyles } from "./GlobalStyles"
import { ThemeProvider } from "./ThemeProvider"

interface GlobalLayoutProps {
  children: React.ReactNode
}

const ContentBackground = styled.div`
  position: relative;
  transition: background-color 1s;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  /* TODO: Just hard code header height for now. Calculate properly later */
  min-height: calc(100vh - 112px);
  /* This stops the collapsing margins creating a gap between the header and content */
  overflow-y: hidden;
`
interface StyledMenuProps {
  isActive: boolean
}
const StyledMenu = styled(Menu)<StyledMenuProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  pointer-events: ${(props) => (props.isActive ? "all" : "none")};
  transition: opacity 200ms ease-out;
  @media (min-width: ${BREAKPOINTS.sm}px) {
    display: none;
  }
`

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const [isMenuActive, setIsMenuActive] = React.useState(false)
  return (
    <PageSizeProvider>
      <ThemeProvider>
        <GlobalStyles />
        <Header
          onMenuToggle={() => {
            setIsMenuActive(!isMenuActive)
          }}
          isMenuActive={isMenuActive}
        />
        <PageTransition>
          <ContentBackground>
            {children}
            <StyledMenu
              isActive={isMenuActive}
              onClick={() => {
                setIsMenuActive(false)
              }}
            />
          </ContentBackground>
        </PageTransition>
      </ThemeProvider>
    </PageSizeProvider>
  )
}
