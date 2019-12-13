import React, { createContext, useState, useEffect } from "react"
import debounce from "lodash/debounce"
import { MobileLayout } from "./mobile"
import { DesktopLayout } from "./desktop"
import GlobalStyles from "./global-styles"
import { useAppState } from './store';

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

export const Layout = ({ children, focusMode }) => {
  const [screenSize, setScreenSize] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(null)

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

  const appState = useAppState();

  if (isLoading || typeof isMobile !== "boolean") return null
  const layoutMeta = { theme, screenSize, isMobile }
  const LayoutForPlatform = isMobile ? MobileLayout : DesktopLayout
  return (
    <LayoutContext.Provider value={layoutMeta}>
      <AppStateContext.Provider value={appState}>
        <LayoutForPlatform focusMode={focusMode}>
          <GlobalStyles />
          {children}
        </LayoutForPlatform>
      </AppStateContext.Provider>
    </LayoutContext.Provider>
  )
}
