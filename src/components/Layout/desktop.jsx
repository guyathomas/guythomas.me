import React, { useContext } from "react"
import styled from "@emotion/styled"

import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
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
  filter: ${props => props.blur ? 'blur(5px)' : 'none'};
`

const BioWrapper = styled.div`
  position: absolute;
  color: white;
`

const Panel = styled.div`
  display: flex;
  flex-grow: ${props => (props.grow ? 3 : 1)};
  flex-basis: 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
`

const PostWrapper = styled.div`
  padding: 1rem 2rem 1rem 4rem;
  overflow-y: scroll;
  height: 100%;
  max-width: 40rem;
`

export const DesktopLayout = ({ children, focusedView = true }) => {
  const {
    theme: { breakpoints },
  } = useContext(LayoutContext)

  return (
    <Main maxWidth={breakpoints.max}>
      <SEO title="All posts" />
      <Panel>
          <Portrait blur={focusedView} />
        {!focusedView && (
          <BioWrapper>
            <Bio />
          </BioWrapper>
        )}
      </Panel>
      <Panel grow={focusedView}>
        <PostWrapper>{children}</PostWrapper>
        <SocialLine orientation="vertical" />
      </Panel>
    </Main>
  )
}
