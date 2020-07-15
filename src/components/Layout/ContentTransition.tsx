import * as React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import { TransitionContext, TRANSITIONS } from "~contexts"
import { TransitionStatus } from "react-transition-group/Transition"

interface ContentTransitionStyledProps {
  status: TransitionStatus
}

const ContentTransitionStyled = styled.div<ContentTransitionStyledProps>`
  ${(props) => getTransitionStyles(props.status)}
`

const getTransitionStyles = (status: TransitionStatus) => {
  switch (status) {
    case "entering":
      return css`
        position: absolute;
        opacity: 0;
      `
    case "entered":
      return css`
        ${TRANSITIONS.page}
        opacity: 1;
      `
    case "exiting":
      return css`
        ${TRANSITIONS.page}
        opacity: 0;
      `
    default:
      return css``
  }
}
interface ContentTransitionProps {
  children: React.ReactNode
}
export const ContentTransition: React.FC<ContentTransitionProps> = ({
  children,
}) => {
  const transition = React.useContext(TransitionContext)

  return (
    <ContentTransitionStyled status={transition.status}>
      {children}
    </ContentTransitionStyled>
  )
}
