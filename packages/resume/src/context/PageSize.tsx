import React from "react"
import ReactResizeDetector from "react-resize-detector"

interface PageSizeContext {
  width: number | null
  height: number | null
}
interface PageSizeProviderProps {
  children: React.ReactNode
}

const INITIAL_PAGE_SIZE: PageSizeContext = {
  width: null,
  height: null,
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
