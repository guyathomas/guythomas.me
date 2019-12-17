import React, { useContext, useRef, useState } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import throttle from "lodash/throttle"

import { AppStateContext } from "../Layout"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
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

const BioWrapper = styled.div`
  position: absolute;
  color: white;
  padding-bottom: 1rem;
`

const Panel = styled.div`
  display: flex;
  flex-grow: ${props => (props.large ? 3 : 1)};
  flex-basis: 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: ${props => props.overflow || "visible"};
`

const PostWrapper = styled.div`
  padding: 1rem 2rem 1rem 4rem;
  margin-right: 2rem;
  overflow-y: scroll;
  height: 100%;
  max-width: 40rem;
`

const MenuWrapper = styled.div`
  /* TODO: Test animation that goes past 100vw */
  background-color: white;
  top: 0;
  right: 0;
  height: 100vh;
  position: absolute;
  width: 40vw;
  z-index: 5;
  transform: scaleX(${props => (props.isNavigationExpanded ? 1 : 0)});
  transform-origin: right;
  width: auto;
  overflow-x: hidden;
  box-shadow: -4px 0px 6px 0px rgba(0, 0, 0, 0.32);
  padding-right: 6rem;
`

const HamburgerPositioner = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  cursor: pointer;
  transform: translateX(0.5rem);
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

const makeSmaller = props =>
  props.isNavigationExpanded
    ? css`
        transform: scale(0.7) translateY(-4rem);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
      `
    : css`
        transform: scale(1) translateY(0rem);
      `
const transitionDuration = 0.4

const MainMask = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all ${transitionDuration}s;
  transform-origin: bottom;
  flex-shrink: 0;
  bottom: 0;
  position: absolute;
  display: flex;
  ${makeSmaller}
`

export const DesktopLayout = ({ children, focusMode = false }) => {
  const {
    theme: { breakpoints },
  } = useContext(LayoutContext)
  const socialLineRef = useRef(null)
  const [scrolledPastSocial, setScrolledPastSocial] = useState(false)

  const onScroll = throttle(() => {
    if (!socialLineRef.current) return
    const { top, height } = socialLineRef.current.getBoundingClientRect()
    top + height < 0
      ? setScrolledPastSocial(true)
      : setScrolledPastSocial(false)
  }, 100)
  const { state: appState, dispatchers: appDispatchers } = React.useContext(
    AppStateContext
  )
  const { isNavigationExpanded } = appState
  const handleSelectCurrentView = () =>
    isNavigationExpanded && appDispatchers.toggleNavigation()
  return (
    <Main maxWidth={breakpoints.max}>
      <MainInner>
        <HamburgerPositioner>
          <Navigation.NavigationToggler
            toggleNavigation={appDispatchers.toggleNavigation}
            isNavigationExpanded={appState.isNavigationExpanded}
          />
        </HamburgerPositioner>
        <SEO title="All posts" />
        <MainMask
          isNavigationExpanded={isNavigationExpanded}
          onClick={handleSelectCurrentView}
        >
          <Panel overflow="hidden">
            <Portrait blur={focusMode} />
          </Panel>
          <Panel large={focusMode}>
            <PostWrapper onScroll={onScroll}>
              <div ref={socialLineRef}>
                <Bio small />
                <SocialLine />
              </div>
              {children}
              <SocialLine orientation="vertical" visible={scrolledPastSocial} />
            </PostWrapper>
          </Panel>
        </MainMask>
      </MainInner>
    </Main>
  )
}
