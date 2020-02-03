import { useContext, useEffect, useState } from "react"
import get from "lodash/get"
import throttle from "lodash/throttle"
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

export const useScrolledPastRef = (ref) => {
  const [hasScrolledPastRef, setHasScrolledPastRef] = useState(false)

  const onScroll = throttle(() => {
    if (!ref.current) return
    const { top, height } = ref.current.getBoundingClientRect()
    top + height < 0
      ? setHasScrolledPastRef(true)
      : setHasScrolledPastRef(false)
  }, 100)
  return [ onScroll, hasScrolledPastRef ]
}