import React from "react"
import GlobalStyles from "./global-styles"
import { ContentTransition } from "./ContentTransition"
import { TransitionContextProvider } from "./Transition"

export default ({ children, ...routerProps }) => {
  return (
    <TransitionContextProvider pathname={routerProps.location.pathname}>
      <ContentTransition>
        <GlobalStyles />
        {children}
      </ContentTransition>
    </TransitionContextProvider>
  )
}
