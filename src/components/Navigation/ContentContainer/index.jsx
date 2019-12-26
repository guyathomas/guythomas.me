import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import { AppStateContext } from "../../Layout"
import { TransitionConstants } from "../../Layout/Transition"

/*
  Wrap main content so that when navigation is expanded
  it will shrink
*/

const transformPageSize = props =>
  props.isNavigationExpanded
    ? css`
        transform: scale(0.7) translateY(-2rem);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        position: absolute;
        height: 100vh; /* Fallback for browsers that do not support Custom Properties */
        height: calc(var(--vh, 1vh) * 100);
        overflow: hidden;
      `
    : css``

const ContentContainerStyles = styled.div`
  ${TransitionConstants.transitions.page}
  transform-origin: bottom;
  flex-shrink: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  ${transformPageSize}
`

export const ContentContainer = ({ children }) => {
  const { state, dispatchers } = React.useContext(AppStateContext)

  const handleSelectCurrentView = () =>
    state.isNavigationExpanded && dispatchers.toggleNavigation()

  return (
    <ContentContainerStyles
      onClick={handleSelectCurrentView}
      isNavigationExpanded={state.isNavigationExpanded}
    >
      {children}
    </ContentContainerStyles>
  )
}
