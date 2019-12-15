import React from "react"
// import Iframe from "react-iframe"
import styled from "@emotion/styled"

const IframeWrapper = styled.div`
  pointer-events: none;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
  & iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`

export const PagePreview = ({ path }) => (
  <IframeWrapper>
    {/* <Iframe
      url={path}
    /> */}
  </IframeWrapper>
)
