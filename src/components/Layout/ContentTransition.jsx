import React, { useContext } from "react"
import { TransitionContext } from "./Transition"

const getTransitionStyles = transition => {
  switch (transition.status) {
    case "entering":
      return {
        position: "absolute",
        opacity: 0,
      }
    case "entered":
      return {
        transition: `opacity ${transition.timeout}ms ease-in-out`,
        opacity: 1,
      }
    case "exiting":
      return {
        transition: `all ${transition.timeout}ms ease-in-out`,
        opacity: 0,
      }
    default:
      return {}
  }
}

export const ContentTransition = ({ children }) => {
  const transition = useContext(TransitionContext)

  return <div style={getTransitionStyles(transition)}>{children}</div>
}
