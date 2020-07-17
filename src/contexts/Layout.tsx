import React from "react"
import ReactResizeDetector from "react-resize-detector"
import { useLocation } from "@reach/router"

interface ScreenSize {
  width: number
  height: number
}

type LayoutType = "equal" | "biased-right"
interface LayoutContextData {
  screenSize: ScreenSize
  layoutType: LayoutType
}

interface LayoutProviderWrapperProps {
  children: React.ReactNode
}

const INITIAL_LAYOUT_CONTEXT: LayoutContextData = {
  screenSize: { width: 0, height: 0 },
  layoutType: "biased-right",
}

export const LayoutContext = React.createContext(INITIAL_LAYOUT_CONTEXT)

export const LayoutProvider: React.FC<LayoutProviderWrapperProps> = ({
  children,
}) => {
  const location = useLocation()
  const layoutType: LayoutType =
    location.pathname === "/" ? "equal" : "biased-right"
  return (
    <ReactResizeDetector
      handleWidth
      handleHeight
      refreshMode="debounce"
      refreshRate={500}
    >
      {(screenSize: ScreenSize) => (
        <LayoutContext.Provider value={{ screenSize, layoutType }}>
          {children}
        </LayoutContext.Provider>
      )}
    </ReactResizeDetector>
  )
}
