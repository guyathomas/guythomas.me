import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import debounce from "lodash/debounce"
import result from "lodash/result"
import { useScroll } from "react-use-gesture"
import ReactResizeDetector from "react-resize-detector"

import { TransitionConstants } from "./Transition"
import { Navigation } from "../Navigation"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import "./style.css"

const CARD_TOP_PADDING = 28

const Portrait = styled.div`
  z-index: -1;
  position: fixed;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
  width: 100%;
  height: 85vh;
  background-size: cover;
  background-position: center;
`

const Card = styled.div`
  background-color: white;
  position: relative;
  padding: 1rem 0.5rem;
  ${TransitionConstants.transitions.page}
  border-radius: ${props => (props.focusMode ? "0" : "1rem 1rem 0 0")};
  min-height: 100vh;
  &::after {
    display: ${props => (props.focusMode ? "none" : "block")}
    content: "";
    height: 3px;
    width: 3rem;
    background-color: lightgray;
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
  }
`

const InitialCardOffset = styled.div`
  ${TransitionConstants.transitions.page}
  height: 100vh; /* Largest value, will be reduced by max-height */
  max-height: ${props =>
    props.height
      ? `calc(100vh - ${props.height}px - ${CARD_TOP_PADDING}px)`
      : "75vh"};
  max-height: ${props =>
    props.height
      ? `calc(calc(var(--vh, 1vh) * 100) - ${props.height}px - ${CARD_TOP_PADDING}px)`
      : "70vh"};
`

const HamburgerPositioner = styled.div`
  height: 1.4rem;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
  padding-top: 1.7rem;
  padding-right: 1rem;
  box-sizing: content-box;
  cursor: pointer;
  & svg {
    height: 100%;
    width: auto;
  }
  opacity: ${props => (props.hide ? 0 : 1)};
  ${TransitionConstants.transitions.page}
`

const ContentWrapper = styled.div`
  pointer-events: ${props => (props.isNavigationExpanded ? "none" : "all")};
`

const InitialContent = styled.div``

const MobileNavigationItems = styled(Navigation.Links)`
  margin: 0;
  padding: 2rem 15% 0;
  justify-content: center;
  flex-direction: column;
`

export const MobileLayout = ({ children, focusMode }) => {
  const [isBelowHeader, setIsBelowHeader] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const [initialContentHeight, setInitialContentHeight] = useState()
  const [hasLoaded, setHasLoaded] = useState(false)
  const scrollContainerEl = useRef(null)
  const initialContentEl = useRef(null)

  const bindWindowScroll = useScroll(
    ({ direction: [dirX, dirY] }) => {
      const isBelowHeader =
        result(initialContentEl, "current.getBoundingClientRect").top <= 0
      setScrollDirection(dirY)
      setIsBelowHeader(isBelowHeader)
    },
    { domTarget: window }
  )

  useEffect(bindWindowScroll, [bindWindowScroll])

  useEffect(() => {
    const setViewHeightVariable = debounce(() => {
      const vh = window.innerHeight * 0.01
      // Set VH CSS variable so that 100vh will take mobile nav bars into consideration
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }, 100)

    setViewHeightVariable()
    window.addEventListener("resize", setViewHeightVariable)

    return () => window.removeEventListener("resize", setViewHeightVariable)
  }, [])

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  const hideHamburger = scrollDirection === 1 && isBelowHeader
  const handleSetCurrentHeight = (_, height) =>
    (!initialContentHeight || height > initialContentHeight) &&
    setInitialContentHeight(height)

  return (
    <>
      <HamburgerPositioner hide={hideHamburger}>
        <Navigation.Hamburger disableNavigation={hideHamburger} />
      </HamburgerPositioner>
      <MobileNavigationItems />
      <Navigation.ContentContainer>
        <ContentWrapper ref={scrollContainerEl}>
          {hasLoaded && <Portrait />}
          {!focusMode && <InitialCardOffset height={initialContentHeight} />}
          <Card focusMode={focusMode}>
            <InitialContent ref={initialContentEl}>
              <ReactResizeDetector
                handleHeight
                onResize={handleSetCurrentHeight}
              />
              <Bio small={focusMode} />
              <SocialLine />
            </InitialContent>
            {children}
          </Card>
        </ContentWrapper>
      </Navigation.ContentContainer>
    </>
  )
}
