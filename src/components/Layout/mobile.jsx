import React, { useState, useRef, useEffect } from "react"
import { Link } from "gatsby"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import debounce from "lodash/debounce"
import { useScroll } from "react-use-gesture"
import get from "lodash/get"

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
  transition: all 0.25s ease-in-out;
  border-radius: 1rem 1rem 0 0;
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

const CardWrapper = styled.div``

const InitialCardOffset = styled.div`
  transition: all 0.25s ease-in-out;
  height: 100vh;
  max-height: ${props =>
    props.height ? `calc(100vh - ${props.height}px - 28px)` : "75vh"};
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
  overflow-y: scroll;
  height: 100%;
  pointer-events: ${props => (props.isNavigationExpanded ? "none" : "all")};
`

const InitialContent = styled.div``

const MobileNavigationItems = styled(Navigation.NavigationItems)`
  margin: 0;
  padding: 2rem 15% 0;
  justify-content: center;
  flex-direction: column;
`

const FullHeightDetector = styled.div`
  position: absolute;
  height: ${VHWithFallback(100)};
  width: 100vw;
  top: 0;
  left: 0;
`
let lastScrollPosition = 0
export const MobileLayout = ({ children, focusMode }) => {
  const [isCardAtTop, setIsCardAtTop] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const [initialContentHeight, setInitialContentHeight] = useState()
  const [hasLoaded, setHasLoaded] = useState(false)
  const scrollContainerEl = useRef(null)
  const cardEl = useRef(null)
  const initialContentEl = useRef(null)

  const bindScrollDirection = useScroll(({ direction: [dirX, dirY] }) =>
    setScrollDirection(dirY)
  )

  if (cardEl.current && scrollContainerEl.current) {
    let options = {
      root: scrollContainerEl.current,
      threshold: [0.5, 1],
    }
    const onIntersect = (entries, observer) => {
      entries.forEach((entry, i) => {
        console.log("obz", 1, entry)
      })
    }
    let observer = new IntersectionObserver(onIntersect, options)
    observer.observe(cardEl.current)
  }

  useEffect(() => {
    if (cardEl.current && focusMode) {
      cardEl.current.scrollIntoView()
    }
  }, [focusMode, cardEl])

  useEffect(() => {
    if (!initialContentEl.current) return
    const setContentHeight = () => {
      setInitialContentHeight(initialContentEl.current.clientHeight)
    }
    setTimeout(setContentHeight, 100) // HACK - Wait til styles are loaded
  }, [initialContentEl])

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
      <HamburgerPositioner hide={scrollDirection === 1}>
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
            ref={scrollContainerEl}
          >
            {hasLoaded && <Portrait />}
            <InitialCardOffset height={initialContentHeight} />
            <Card {...bindScrollDirection()}>
              <FullHeightDetector ref={cardEl} />
              <InitialContent ref={initialContentEl}>
                <Bio small={focusMode} />
                <SocialLine />
              </InitialContent>
              {children}
            </Card>
          </ContentWrapper>
        </Navigation.ContentContainer>
      </Main>
    </>
  )
}
