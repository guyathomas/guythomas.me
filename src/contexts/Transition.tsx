import React from "react"
import { css } from "@emotion/core"
import { useLocation } from "@reach/router"

import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

import { TransitionStatus } from "react-transition-group/Transition"

interface TransitionContextData {
  status: TransitionStatus
}

const INITIAL_CONTEXT_STATE: TransitionContextData = {
  status: "entered",
}

const TRANSITION_DURATION_PAGE = 250
export const TRANSITIONS = {
  page: css`
    transition: all ${TRANSITION_DURATION_PAGE}ms ease-in-out;
  `,
}

export const TransitionContext = React.createContext(INITIAL_CONTEXT_STATE)

export const TransitionProvider = ({ children }) => {
  const location = useLocation()

  return (
    <TransitionGroup>
      <ReactTransition
        key={location.pathname}
        timeout={{
          enter: TRANSITION_DURATION_PAGE,
          exit: TRANSITION_DURATION_PAGE,
        }}
      >
        {(status) => (
          <TransitionContext.Provider value={{ status }}>
            {children}
          </TransitionContext.Provider>
        )}
      </ReactTransition>
    </TransitionGroup>
  )
}
