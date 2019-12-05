import React, { createContext, useState, useEffect } from "react"
import debounce from "lodash/debounce"
import { MobileLayout } from "./mobile"
import { DesktopLayout } from "./desktop"
import GlobalStyles from "./global-styles"

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

export const Layout = ({ children, options }) => {
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

  if (isLoading || typeof isMobile !== "boolean") return null
  const layoutMeta = { theme, screenSize, isMobile }
  const LayoutForPlatform = isMobile ? MobileLayout : DesktopLayout
  return (
    <LayoutContext.Provider value={layoutMeta}>
      <LayoutForPlatform options={options}>
        <GlobalStyles />
        {children}
      </LayoutForPlatform>
    </LayoutContext.Provider>
  )
}
