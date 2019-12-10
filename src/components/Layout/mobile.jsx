import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import result from "lodash/result"
import get from "lodash/get"
import debounce from "lodash/debounce"

import { AppStateContext } from '../Layout'
import { Navigation } from "../Navigation"
import HamburgerSquare from "../Navigation/icons/hamburger.svg"
import Cross from "../Navigation/icons/cross.svg"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import "./style.css"

const VHWithFallback = (units = 0) => `
  height: ${units}vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * ${units});
`

const Main = styled.main`
  scroll-snap-type: y mandatory;
  height: ${VHWithFallback(100)};
  overflow-y: scroll;
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
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 0.5rem;
  overflow-y: ${props => (props.allowScrolling ? "scroll" : "hidden")};
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

const MenuWrapper = styled.div`
  /* TODO: Test animation that goes past 100vw */
  width: 120vw;
  background-color: white;
  top: 0;
  right: 0;
  height: 100vh;
  position: fixed;
  z-index: 5;
  transition: left 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  left: ${props => (props.isNavigationExpanded ? 0 : "100vw")};
`

const HamburgerWrapper = styled.div`
  height: 2rem;
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

const vibrateDevice = () => {
  // Only supported on Android Chrome & Firefox
  if (get(window, "navigator.vibrate")) {
    return window.navigator.vibrate(200)
  }
  return false
}

let lastScrollPosition = 0
export const MobileLayout = ({ children, focusMode }) => {
  const [allowCardScrolling, setAllowCardScrolling] = useState(false)
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
      const newAllowScrollingValue = clientRect.top <= 1 ? true : false
      const scrollingStateWillChange =
        newAllowScrollingValue !== allowCardScrolling
      if (scrollingStateWillChange) {
        vibrateDevice()
        setAllowCardScrolling(newAllowScrollingValue)
      }
    },
    50,
    { leading: true }
  )

  const minimizeCard = () => {
    if (!mainEl || !mainEl.current) return
    if (!cardEl || !cardEl.current) return
    const topSmoothly = { top: 0, left: 0, behavior: "smooth" }
    cardEl.current.scrollTo(topSmoothly)
    mainEl.current.scrollTo(topSmoothly)
  }

  // TODO: Remove this - testing only
  // window.minimizeCard = minimizeCard;

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
  const { state: appState, dispatchers: appDispatchers } = React.useContext(AppStateContext)
  return (
    <Main onScroll={handleScroll} ref={mainEl}>
      {hasLoaded && <Portrait />}
      <HamburgerWrapper hide={scrollDirection === "down"}>
        <Navigation.NavigationToggler toggleNavigation={appDispatchers.toggleNavigation} isNavigationExpanded={appState.isNavigationExpanded} />
      </HamburgerWrapper>
      <MenuWrapper isNavigationExpanded={appState.isNavigationExpanded}>
        <Navigation.MenuItems />
      </MenuWrapper>
      <InitialCardOffset />
      <CardWrapper>
        <Card allowScrolling={allowCardScrolling} ref={cardEl}>
          <Bio small={focusMode} />
          <SocialLine />
          {children}
        </Card>
      </CardWrapper>
    </Main>
  )
}
