import React, { createContext, useContext } from "react"
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

const INITIAL_CONTEXT_STATE = {
  status: "entered",
  timeout: 250,
}

export const TransitionContext = createContext(INITIAL_CONTEXT_STATE)

export const TransitionContextProvider = ({ children, pathname }) => {
  const transitionContextValue = useContext(TransitionContext)

  return (
    <TransitionGroup>
      <ReactTransition
        key={pathname}
        timeout={{
          enter: transitionContextValue.timeout,
          exit: transitionContextValue.timeout,
        }}
      >
        {status => (
          <TransitionContext.Provider
            value={{ ...transitionContextValue, status }}
          >
            {children}
          </TransitionContext.Provider>
        )}
      </ReactTransition>
    </TransitionGroup>
  )
}
