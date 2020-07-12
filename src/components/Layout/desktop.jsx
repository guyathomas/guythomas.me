import React, { useRef, useContext } from "react"
import styled from "@emotion/styled"

import { LayoutContext } from "../Layout"
import { useScrolledPastRef, useScrollTopOnRouteChange } from "./hooks"
import { DesktopLayoutPanels } from "./DesktopLayoutPanels"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import "./style.css"

const PostWrapper = styled.div`
  padding: 1rem 2rem 1rem 4rem;
  overflow-y: scroll;
  height: 100%;
  max-width: 40rem;
  width: 100%;
`

export const DesktopLayout = ({ children }) => {
  const socialLineRef = useRef(null)
  const postWrapperRef = useRef(null)
  const { viewMode } = useContext(LayoutContext)

  const [onScroll, hasScrolledPastSocialLine] = useScrolledPastRef(
    socialLineRef
  )

  useScrollTopOnRouteChange(postWrapperRef)

  return (
    <DesktopLayoutPanels>
      <PostWrapper ref={postWrapperRef} onScroll={onScroll}>
        <div ref={socialLineRef}>
          <Bio small={viewMode === "focus"} />
          <SocialLine />
        </div>
        {children}
        <SocialLine
          orientation="vertical"
          visible={hasScrolledPastSocialLine}
        />
      </PostWrapper>
    </DesktopLayoutPanels>
  )
}
