import React, { useContext, useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"

import get from "lodash/get"
import result from "lodash/result"
import throttle from "lodash/throttle"
import { useScroll } from "react-use-gesture"
import ReactResizeDetector from "react-resize-detector"

import { LayoutContext } from "../Layout"
import { useScrollTopOnRouteChange } from "./hooks"
import { TransitionConstants } from "./Transition"
import { Navigation } from "../Navigation"
import { links } from "../Navigation/Links"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import "./style.css"

const CARD_TOP_PADDING = 28

const Portrait = styled.div`
  width: 100%;
  z-index: -1;
  position: fixed;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
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
    display: ${props => (props.focusMode ? "none" : "block")};
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
    `calc(100vh - ${props.height || 0}px - ${CARD_TOP_PADDING}px)`};
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
  overflow-y: scroll;
`

const InitialContent = styled.div``

const AllContentWrapper = styled.div`
  display: block;
  width: 100vw;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
  justify-content: space-between;
  overflow-x: scroll;
  position: relative;
`

export const MobileLayout = ({ children, focusMode }) => {
  const [isBelowHeader, setIsBelowHeader] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const [initialContentHeight, setInitialContentHeight] = useState()
  const [hasLoaded, setHasLoaded] = useState(false)
  const scrollContainerEl = useRef(null)
  const initialContentEl = useRef(null)
  const [activePagePreviewIndex, setActivePagePreviewIndex] = useState(0)

  // TODO: Move this into calculated value
  const remInPx = 16
  const distanceBetweenPreviews = 8 * remInPx
  const remOffset = 3

  const bindScroll = useScroll(({ direction: [dirX, dirY] }) => {
    const isBelowHeader =
      result(initialContentEl, "current.getBoundingClientRect").top <= 0
    setScrollDirection(dirY)
    setIsBelowHeader(isBelowHeader)
  })

  const throttledScrollListener = throttle(({ xy: [x, y] }) => {
    const indexOfFocusedPreview = Math.floor(
      (x + remOffset * remInPx) / distanceBetweenPreviews
    )
    if (indexOfFocusedPreview !== activePagePreviewIndex) {
      setActivePagePreviewIndex(indexOfFocusedPreview)
    }
  }, 50)
  const bindPagePreviewScroll = useScroll(throttledScrollListener)

  useScrollTopOnRouteChange(scrollContainerEl)

  useEffect(() => {
    setHasLoaded(true)
  }, [])

  useEffect(() => {
    const setViewHeightVariable = () => {
      const vh = window.innerHeight * 0.01
      // Set VH CSS variable so that 100vh will take mobile nav bars into consideration
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    setViewHeightVariable()
    window.addEventListener("resize", setViewHeightVariable)

    return () => window.removeEventListener("resize", setViewHeightVariable)
  }, [])



  const hideHamburger = scrollDirection === 1 && isBelowHeader
  const handleSetCurrentHeight = (_, height) => setInitialContentHeight(height)

  // Separate into custom hook
  const { routerProps } = useContext(LayoutContext)
  const pathname = get(routerProps, "location.pathname")
  const visibleLinks = links.filter(({ path }) => path !== pathname)

  return (
    <>
      <HamburgerPositioner hide={hideHamburger}>
        <Navigation.Hamburger disableNavigation={hideHamburger} />
      </HamburgerPositioner>
      <AllContentWrapper {...bindPagePreviewScroll()}>
        <Navigation.ContentContainer
          activeIndex={activePagePreviewIndex}
          index={0}
          zIndex={visibleLinks.length + 1}
          viewState={activePagePreviewIndex === 0 ? "active" : "before"}
        >
          <ContentWrapper ref={scrollContainerEl} {...bindScroll()}>
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
        <Navigation.PagePreviews
          activeIndex={activePagePreviewIndex}
          links={visibleLinks}
        />
      </AllContentWrapper>
    </>
  )
}
