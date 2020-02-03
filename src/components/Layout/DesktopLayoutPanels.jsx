import React, { useContext } from "react"
import styled from "@emotion/styled"

import { TransitionConstants } from "./Transition"
import { Navigation } from "../Navigation"
import { SEO } from "../Seo"
import "./style.css"
import { LayoutContext } from "."

const Main = styled.main`
  height: 100vh;
  max-width: ${props => props.maxWidth}px;
  padding: 0 3rem;
  margin: auto;
`

const MainInner = styled.div`
  position: relative;
  display: flex;
  height: 100%;
`

const Portrait = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: ${props => (props.blur ? "blur(5px)" : "none")};
`

const Panel = styled.div`
  display: flex;
  flex-grow: ${props => (props.large ? 3 : 1)};
  flex-basis: 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  ${TransitionConstants.transitions.page}
`

const OptionalPanel = styled(Panel)`
  display: none;
  overflow: hidden;
  @media (min-width: ${props => props.hideAtPx}px) {
    display: block;
  }
`

const HamburgerPositioner = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  cursor: pointer;
  transform: translateX(0.2rem);
  top: 1rem;
  background-color: white;
  box-sizing: content-box;
  padding: 1rem 0;
  height: 1.5rem;
  & svg {
    height: 100%;
    width: auto;
  }
`

const DesktopNavigationItems = styled(Navigation.Links)`
  position: absolute;
  right: 0;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 7rem;
  text-align: right;
`

export const DesktopLayoutPanels = ({ children, focusMode = false }) => {
  const {
    theme: { breakpoints },
  } = useContext(LayoutContext)

  return (
    <Main maxWidth={breakpoints.max}>
      <MainInner>
        <HamburgerPositioner>
          <Navigation.Hamburger />
        </HamburgerPositioner>
        <SEO title="All posts" />
        <DesktopNavigationItems />
        <Navigation.ContentContainer>
          <OptionalPanel hideAtPx={breakpoints.md}>
            <Portrait blur={focusMode} />
          </OptionalPanel>
          <Panel large={focusMode}>
            {children}
          </Panel>
        </Navigation.ContentContainer>
      </MainInner>
    </Main>
  )
}
