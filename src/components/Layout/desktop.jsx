import React, { useState, useRef, useContext } from "react"
import styled from "@emotion/styled"

import { PostSnippit } from "../PostSnippit"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import { SEO } from "../Seo"
import { ThemeContext } from "../../pages"
import "./style.css"

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
`

const BioWrapper = styled.div`
  position: absolute;
  color: white;
`

const Panel = styled.div`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`

const PostWrapper = styled.div`
  padding: 1rem 2rem;
  overflow-y: scroll;
  height: 100%;
`

export const DesktopLayout = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  const {
    theme: { breakpoints },
  } = useContext(ThemeContext)

  return (
    <Main maxWidth={breakpoints.max}>
      <SEO title="All posts" />
      <Panel>
        <Portrait />
        <BioWrapper>
          <Bio />
        </BioWrapper>
      </Panel>
      <Panel>
        <PostWrapper>
          {posts.map(post => (
            <PostSnippit key={post.node.fields.slug} {...post} />
          ))}
        </PostWrapper>
        <SocialLine orientation="vertical" />
      </Panel>
    </Main>
  )
}
