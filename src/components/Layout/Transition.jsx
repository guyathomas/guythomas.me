import React, { createContext, useContext } from "react"
import { css } from "@emotion/core"

import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

const INITIAL_CONTEXT_STATE = {
  status: "entered",
}

const pageTransitionMs = 250;

export const TransitionConstants = {
  pageTransitionMs,
  transitions: {
    page: css`transition: all ${pageTransitionMs}ms ease-in-out;`
  }
}

export const TransitionContext = createContext(INITIAL_CONTEXT_STATE)

export const TransitionContextProvider = ({ children, pathname }) => {
  const transitionContextValue = useContext(TransitionContext)

  return (
    <TransitionGroup>
      <ReactTransition
        key={pathname}
        timeout={{
          enter: TransitionConstants.pageTransitionMs,
          exit: TransitionConstants.pageTransitionMs,
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
