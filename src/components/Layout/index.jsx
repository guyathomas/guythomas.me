import React, { createContext, useState, useEffect } from "react"
import get from "lodash/get"
import debounce from "lodash/debounce"
import { MobileLayout } from "./mobile"
import { DesktopLayout } from "./desktop"
import { DesktopLayoutPanels } from "./DesktopLayoutPanels"
import GlobalStyles from "./global-styles"
import { ContentTransition } from "./ContentTransition"
import { TransitionContextProvider } from "./Transition"

const theme = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    max: 1440,
  },
}

export const LayoutContext = createContext(theme)

export default ({ children, ...routerProps }) => {
  const [screenSize, setScreenSize] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(null)
  // TODO: Change to have only home page not use focusMode
  const splitScreenRoutes = ["^/$"]
  const resumeModeRoutes = ["^/resume/"]

  let viewMode = "focus"
  const routeDoesMatch = route => routerProps.path.match(new RegExp(route))
  if (splitScreenRoutes.some(routeDoesMatch)) viewMode = "splitScreen"
  if (resumeModeRoutes.some(routeDoesMatch)) viewMode = "resume"

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const debouncedSetScreen = debounce(() => {
      const { screen } = window
      setScreenSize(screen)
      setIsMobile(screen.width < theme.breakpoints.md)
    }, 100)
    debouncedSetScreen()
    window.addEventListener("resize", debouncedSetScreen)
    return () => window.removeEventListener("resize", debouncedSetScreen)
  }, [])

  if (isLoading || typeof isMobile !== "boolean") return null
  const layoutMeta = { theme, screenSize, isMobile, routerProps, viewMode }
  const LayoutForPlatform = isMobile ? MobileLayout : DesktopLayout

  return (
    <LayoutContext.Provider value={layoutMeta}>
      <TransitionContextProvider pathname={routerProps.location.pathname}>
        <ContentTransition>
          <LayoutForPlatform>
            <GlobalStyles />
            {children}
          </LayoutForPlatform>
        </ContentTransition>
      </TransitionContextProvider>
    </LayoutContext.Provider>
  )
}
