import React from "react"
import Iframe from "react-iframe"
import { navigate } from "gatsby"
import styled from "@emotion/styled"

import { AppStateContext } from "../../Layout"
import { ContentContainer } from "../ContentContainer"

const IframeWrapper = styled.div`
  pointer-events: none;
  overflow: hidden;
  position: relative;
  width: 100%;
  & iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
  }
`

const RouteLabel = styled.h2`
  position: absolute;
  top: 0;
  transform: translate(-50%, -150%);
  margin: 0;
  left: 50%;
`

const DummySpace = styled.div`
  width: 100vw;
  height: 100%;
  position: absolute;
  left: ${props => props.left}rem;
  z-index: 1;
  transform: scale(0.7) translateY(12rem);
  transform-origin: top;
  pointer-events: none;
`

export const PagePreviews = ({ activeIndex, links }) => {
  const {
    state: { isNavigationExpanded },
  } = React.useContext(AppStateContext)

  if (!isNavigationExpanded) return null
  const handleClickRoute = path => navigate(path)
  const previews = links.map(({ path, label }, index) => {
    const actualIndex = index + 1 // Add one, since 0 resembled the hard coded current view
    let viewState
    if (activeIndex === actualIndex) {
      viewState = "active"
    } else if (actualIndex - 1 >= activeIndex) {
      viewState = "after"
    } else if (actualIndex + 1 <= activeIndex) {
      viewState = "before"
    }
    return (
      <ContentContainer
        onClick={() => handleClickRoute(path)}
        left={actualIndex}
        viewState={viewState}
        index={actualIndex}
        zIndex={links.length - index}
      >
        <RouteLabel>{label}</RouteLabel>
        <IframeWrapper key={path}>
          <Iframe url={path} />
        </IframeWrapper>
      </ContentContainer>
    )
  })

  return (
    <>
      {previews}
      <DummySpace left={(links.length) * ContentContainer.PAGE_PREVIEW_SPACING + 4} />
    </>
  )
}
