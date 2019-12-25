import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"

import { AppStateContext } from "../../Layout"
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
      `
    : css`
        transform: scale(1) translateY(0rem);
      `

const ContentContainerStyles = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  transition: all 0.4s;
  transform-origin: bottom;
  flex-shrink: 0;
  bottom: 0;
  position: absolute;
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
