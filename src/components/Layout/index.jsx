import React, { createContext, useState, useEffect } from "react"
import get from "lodash/get"
import debounce from "lodash/debounce"
import { MobileLayout } from "./mobile"
import { DesktopLayout } from "./desktop"
import { DesktopLayoutPanels } from "./DesktopLayoutPanels"
import GlobalStyles from "./global-styles"
import { useAppState } from "./store"
import { ContentTransition } from "./ContentTransition"
import { TransitionContextProvider } from "./Transition"
import { VANILLA_LAYOUT } from "./constants"

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
export const AppStateContext = createContext(null)

export default ({ children, ...routerProps }) => {
  const [screenSize, setScreenSize] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(null)
  const focusModeRoutes = ["^/blog/"]
  const resumeModeRoutes = ["^/resume/"]
  
  let viewMode = "splitScreen"
  const routeDoesMatch = route => routerProps.path.match(new RegExp(route))
  if (focusModeRoutes.some(routeDoesMatch)) viewMode = "focus"
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

  const appState = useAppState()

  if (isLoading || typeof isMobile !== "boolean") return null
  const layoutMeta = { theme, screenSize, isMobile, routerProps, viewMode }
  const LayoutForPlatform = isMobile ? MobileLayout : DesktopLayout
  const useEmptyLayout =
    get(routerProps, "pageContext.layout") === VANILLA_LAYOUT

  const main = useEmptyLayout ? (
    <DesktopLayoutPanels>{children}</DesktopLayoutPanels>
  ) : (
    <LayoutForPlatform>
      <GlobalStyles />
      {children}
    </LayoutForPlatform>
  )

  return (
    <LayoutContext.Provider value={layoutMeta}>
      <AppStateContext.Provider value={appState}>
        <TransitionContextProvider pathname={routerProps.location.pathname}>
          <ContentTransition>{main}</ContentTransition>
        </TransitionContextProvider>
      </AppStateContext.Provider>
    </LayoutContext.Provider>
  )
}
