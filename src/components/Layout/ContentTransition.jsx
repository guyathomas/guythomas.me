import React, { useContext } from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import { TransitionContext, TransitionConstants } from "./Transition"

const ContentTransitionStyled = styled.div`
  ${props => getTransitionStyles(props.transition)}
`

const getTransitionStyles = transition => {
  switch (transition.status) {
    case "entering":
      return css`
        position: absolute;
        opacity: 0;
      `
    case "entered":
      return css`
        ${TransitionConstants.transitions.page}
        opacity: 1;
      `
    case "exiting":
      return css`
        ${TransitionConstants.transitions.page}
        opacity: 0;
      `
    default:
      return css``
  }
}

export const ContentTransition = ({ children }) => {
  const transition = useContext(TransitionContext)

  return (
    <ContentTransitionStyled transition={transition}>
      {children}
    </ContentTransitionStyled>
  )
}
