import React from "react"
import { LayoutProvider, TransitionProvider } from "~contexts"

import { GlobalStyles } from "./GlobalStyles"
import { ContentTransition } from "./ContentTransition"
import { TransitionContextProvider } from "~contexts/Transition"

export default ({ children }) => {
  return (
    <LayoutProvider>
      <TransitionProvider>
        <ContentTransition>
          <GlobalStyles />
          {children}
        </ContentTransition>
      </TransitionProvider>
    </LayoutProvider>
  )
}
