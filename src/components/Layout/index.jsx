import React, { createContext, useState, useEffect } from "react"
import debounce from "lodash/debounce"
import { MobileLayout } from "./mobile"
import { DesktopLayout } from "./desktop"

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

export const Layout = ({ children, focusedView = false }) => {
  const [screenSize, setScreenSize] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const debouncedSetScreen = debounce(() => {
    const { screen } = window
    setScreenSize(screen)
    setIsMobile(screen.width < theme.breakpoints.md)
  }, 100)

  useEffect(() => {
    debouncedSetScreen()
    window.addEventListener("resize", debouncedSetScreen)
    return () => window.removeEventListener("resize", debouncedSetScreen)
  }, [debouncedSetScreen])

  if (isLoading || typeof isMobile !== "boolean") return null
  const layoutMeta = { theme, screenSize, isMobile }
  const LayoutForPlatform = isMobile ? MobileLayout : DesktopLayout;
  return (
    <LayoutContext.Provider value={layoutMeta}>
      <LayoutForPlatform focusedView={focusedView}>
        {typeof children === "function" ? children(layoutMeta) : children}
      </LayoutForPlatform>
    </LayoutContext.Provider>
  )
}
