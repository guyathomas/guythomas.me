import React, { useContext, useRef, useState } from "react"
import styled from "@emotion/styled"
import throttle from "lodash/throttle"

import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import { Header } from "../Header"
import { SEO } from "../Seo"
import "./style.css"
import { LayoutContext } from "."

const Main = styled.main`
  height: 100vh;
  max-width: ${props => props.maxWidth}px;
  display: flex;
  justify-content: center;
  padding: 0 3rem;
  margin: auto;
`

const Portrait = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: ${props => (props.blur ? "blur(5px)" : "none")};
`

const BioWrapper = styled.div`
  position: absolute;
  color: white;
  padding-bottom: 1rem;
`

const Panel = styled.div`
  display: flex;
  flex-grow: ${props => (props.large ? 3 : 1)};
  flex-basis: 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
`

const PostWrapper = styled.div`
  padding: 1rem 2rem 1rem 4rem;
  margin-right: 2rem;
  overflow-y: scroll;
  height: 100%;
  max-width: 40rem;
`

const HeaderWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  ${props =>
    props.focusMode
      ? `
  display: flex;
  justify-content: center;
  align-items: center;
  & ul {
    flex-direction: column;
  }
  `
      : 0}
`

export const DesktopLayout = ({ children, focusMode = false }) => {
  const {
    theme: { breakpoints },
  } = useContext(LayoutContext)
  const socialLineRef = useRef(null)
  const [scrolledPastSocial, setScrolledPastSocial] = useState(false)

  const onScroll = throttle(() => {
    if (!socialLineRef.current) return
    const { top, height } = socialLineRef.current.getBoundingClientRect()
    top + height < 0
      ? setScrolledPastSocial(true)
      : setScrolledPastSocial(false)
  }, 100)

  return (
    <Main maxWidth={breakpoints.max}>
      <SEO title="All posts" />
      <Panel>
        <Portrait blur={focusMode} />
      </Panel>
      <Panel large={focusMode}>
        <PostWrapper onScroll={onScroll}>
          <div ref={socialLineRef}>
            <Bio small />
            <SocialLine />
          </div>
          {children}
          <SocialLine orientation="vertical" visible={scrolledPastSocial} />
        </PostWrapper>
      </Panel>
    </Main>
  )
}