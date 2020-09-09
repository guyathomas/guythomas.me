import React from "react"
import ReactResizeDetector from "react-resize-detector"
import { BREAKPOINTS } from "~styles"

interface PageSizeContext {
  width: number
  height: number
}
interface PageSizeProviderProps {
  children: React.ReactNode
}

const INITIAL_PAGE_SIZE: PageSizeContext = {
  width: BREAKPOINTS.md,
  height: 0,
}
export const PageSizeContext = React.createContext<PageSizeContext>(
  INITIAL_PAGE_SIZE
)

export const PageSizeProvider: React.FC<PageSizeProviderProps> = ({
  children,
}) => {
  const [pageSize, setPageSize] = React.useState<PageSizeContext>(
    INITIAL_PAGE_SIZE
  )
  const onResize = React.useCallback((width: number, height: number) => {
    setPageSize({ width, height })
  }, [])

  return (
    <ReactResizeDetector handleWidth handleHeight onResize={onResize}>
      <PageSizeContext.Provider value={pageSize}>
        {children}
      </PageSizeContext.Provider>
    </ReactResizeDetector>
  )
}
