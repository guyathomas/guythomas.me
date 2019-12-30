import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import noop from "lodash/noop"

import { AppStateContext } from "../../Layout"
import { TransitionConstants } from "../../Layout/Transition"

/*
  Wrap main content so that when navigation is expanded
  it will shrink
*/

const transformPageSize = props =>
  props.isNavigationExpanded
    ? css`
        transform: scale(0.7) translateY(12rem) translateX(${props.translateX}rem);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        height: 100vh;
      `
    : css``

const ContentContainerStyles = styled.div`
  ${TransitionConstants.transitions.page}
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transform-origin: top;
  position: absolute;
  left: ${props => props.left}rem;
  z-index: ${props => props.zIndex || 1};
  ${transformPageSize};
`

/*
  Unfortunately this causes a terrible experience
  when the browser does not support css transitions
  TODO: Change to use react spring and manually transition it
*/
const offsetMap = {
  before: 0, // -8
  active: 0,
  after: 0, // 8
}

export const ContentContainer = ({
  children,
  onClick = noop,
  className = "",
  viewState,
  index,
  zIndex,
}) => {
  const { state, dispatchers } = React.useContext(AppStateContext)

  const handleSelectCurrentView = () => {
    if (state.isNavigationExpanded) {
      dispatchers.toggleNavigation()
      onClick()
    }
  }

  return (
    <ContentContainerStyles
      onClick={handleSelectCurrentView}
      isNavigationExpanded={state.isNavigationExpanded}
      className={className}
      left={index * ContentContainer.PAGE_PREVIEW_SPACING}
      translateX={offsetMap[viewState] || 0}
      zIndex={zIndex}
    >
      {children}
    </ContentContainerStyles>
  )
}

ContentContainer.PAGE_PREVIEW_SPACING = 16;