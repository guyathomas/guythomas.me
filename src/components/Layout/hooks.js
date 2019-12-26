import { useContext, useEffect } from "react"
import get from "lodash/get"
import { LayoutContext } from "."

export const useScrollTopOnRouteChange = (scrollContainerEl) => {
  const { routerProps } = useContext(LayoutContext)
  const pathname = get(routerProps, "location.pathname")
  useEffect(() => {
    /*
        HACK: gatsby-plugin-layout preserves scroll position between navigation
        Is to have the window element scroll, but because of the layout here
        I cannot have the window scrolling. So scroll to top when pathname changes
      */
    scrollContainerEl.current.scrollTo(0, 0)
  }, [scrollContainerEl, pathname])
}
