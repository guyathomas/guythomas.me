import React, { useState, useRef, useEffect } from "react"
import { Link } from "gatsby"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import debounce from "lodash/debounce"

import { AppStateContext } from "../Layout"
import { Navigation } from "../Navigation"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import "./style.css"

const VHWithFallback = (units = 0) => css`
  height: ${units}vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * ${units});
`

const Main = styled.main`
  height: ${VHWithFallback(100)};
  overflow-y: hidden;
`

const Portrait = styled.div`
  z-index: -1;
  position: fixed;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
  width: 100%;
  height: ${VHWithFallback(80)};
  background-size: cover;
  background-position: center;
`

const Card = styled.div`
  background-color: white;
  position: relative;
  padding: 1rem 0.5rem;
  overflow-y: ${props => (props.allowScrolling ? "scroll" : "hidden")};
  transition: all 0.25s ease-in-out;
  border-radius: ${props => (props.allowScrolling ? "0" : "1rem 1rem 0 0")};
  height: ${VHWithFallback(100)};
  &::after {
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

const CardWrapper = styled.div`
  scroll-snap-align: start;
`

const InitialCardOffset = styled.div`
  height: ${VHWithFallback(65)};
  scroll-snap-align: start;
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
  transition: opacity 0.25s ease-in-out;
`

const ContentWrapper = styled.div`
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100%;
  pointer-events: ${props => (props.isNavigationExpanded ? "none" : "all")};
`

const MobileNavigationItems = styled(Navigation.NavigationItems)`
  margin: 0;
  padding: 2rem 15% 0;
  justify-content: center;
  flex-direction: column;
`

let lastScrollPosition = 0
export const MobileLayout = ({ children, focusMode }) => {
  const [isCardAtTop, setIsCardAtTop] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const mainEl = useRef(null)
  const cardEl = useRef(null)

  const handleScroll = debounce(
    () => {
      if (!cardEl.current) return
      const clientRect = cardEl.current.getBoundingClientRect()
      const scrollPos = cardEl.current.scrollTop
      let newScrollDirection = scrollPos > lastScrollPosition ? "down" : "up"
      lastScrollPosition = scrollPos
      setScrollDirection(newScrollDirection)
      setIsCardAtTop(clientRect.top <= 1 ? true : false)
    },
    50,
    { leading: true }
  )

  const minimizeCard = () => {
    // TODO: Remove this - testing only
    // window.minimizeCard = minimizeCard;
    if (!mainEl || !mainEl.current) return
    if (!cardEl || !cardEl.current) return
    const topSmoothly = { top: 0, left: 0, behavior: "smooth" }
    cardEl.current.scrollTo(topSmoothly)
    mainEl.current.scrollTo(topSmoothly)
  }

  useEffect(() => {
    if (cardEl.current && focusMode) {
      cardEl.current.scrollIntoView()
    }
  }, [focusMode, cardEl])

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
  const { state: appState, dispatchers: appDispatchers } = React.useContext(
    AppStateContext
  )
  const { isNavigationExpanded } = appState
  const handleSelectCurrentView = () =>
    isNavigationExpanded && appDispatchers.toggleNavigation()

  return (
    <>
      <HamburgerPositioner hide={scrollDirection === "down"}>
        <Navigation.NavigationToggler
          toggleNavigation={appDispatchers.toggleNavigation}
          isNavigationExpanded={isNavigationExpanded}
        />
      </HamburgerPositioner>
      <Main>
        <MobileNavigationItems />
        <Navigation.ContentContainer
          isNavigationExpanded={isNavigationExpanded}
          onClick={handleSelectCurrentView}
        >
          <ContentWrapper
            isNavigationExpanded={isNavigationExpanded}
            onScroll={handleScroll}
            ref={mainEl}
          >
            {hasLoaded && <Portrait />}
            <InitialCardOffset />
            <CardWrapper>
              <Card allowScrolling={isCardAtTop} ref={cardEl}>
                <Bio small={focusMode} />
                <SocialLine />
                {children}
              </Card>
            </CardWrapper>
          </ContentWrapper>
        </Navigation.ContentContainer>
      </Main>
    </>
  )
}
