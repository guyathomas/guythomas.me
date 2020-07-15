import React, { useContext } from "react"
import styled from "@emotion/styled"

import { TRANSITIONS } from "../../contexts/Transition"
import { Hamburger } from "../Hamburger"
import { SEO } from "../SEO"

import "./style.css"
import { LayoutContext } from "."
import { Link } from "gatsby"
import { links } from "../../constants"

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
  background-image: url("${props => props.url}");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  /* filter: ${props =>
    props.blur ? "blur(5px) grayscale(100%)" : "blur(0) grayscale(0)"}; */
  filter: ${props => (props.blur ? "blur(5px)" : "blur(0)")};
`

const Panel = styled.div`
  display: flex;
  flex-grow: ${props => (props.large ? 3 : 1)};
  flex-basis: 0;
  flex-shrink: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  ${TRANSITIONS.page}
`

const OptionalPanel = styled(Panel)`
  flex-shrink: 2;
  display: none;
  overflow: hidden;
  height: 100%;
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
const NavList = styled.ul`
  list-style: none;
  display: flex;
  font-size: 1.5rem;
  margin: 0;
  position: absolute;
  right: 0;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 7rem;
  text-align: right;
`

const NavItem = styled.li`
  margin: 0;
`
const Content = styled.div`
  height: 100%;
`

export const DesktopLayoutPanels = ({ children }) => {
  const {
    theme: { breakpoints },
    viewMode,
  } = useContext(LayoutContext)
  const isRightPanelLarge = viewMode !== "splitScreen"
  const blackAndWhiteURL =
    "https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png"
  const colorURL =
    "https://res.cloudinary.com/dqvlfpaev/image/upload/v1580691840/avatar_sz1jui.jpg"

  return (
    <Main maxWidth={breakpoints.max}>
      <MainInner>
        <OptionalPanel hideAtPx={breakpoints.md}>
          <Portrait blur={isRightPanelLarge} url={blackAndWhiteURL} />
        </OptionalPanel>
        <Panel large={isRightPanelLarge}>
          <Content>
            {/* <NavList>
              {links.map(({ label, path }) => (
                <NavItem>
                  <Link to={path}>{label}</Link>
                </NavItem>
              ))}
            </NavList> */}
            {children}
          </Content>
        </Panel>
      </MainInner>
    </Main>
  )
}
