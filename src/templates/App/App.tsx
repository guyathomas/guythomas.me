import React from "react"
import styled from "@emotion/styled"
import PageTransition from "gatsby-plugin-page-transitions"
import { Header } from "~components/Header"
import { Menu } from "~components/Menu"
import { COLOR_PALETTE, BREAKPOINTS } from "~styles"
import { Providers } from "./Providers"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

interface AppProps {
  children: React.ReactNode
}

const ContentBackground = styled.div`
  position: relative;
  transition: background-color 1s;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  /* TODO: Just hard code header height for now. Calculate properly later */
  min-height: calc(100vh - 67px);
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

export const App: React.FC<AppProps> = ({ children }) => {
  const [isMenuActive, setIsMenuActive] = React.useState(false)
  return (
    <Providers>
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
    </Providers>
  )
}
