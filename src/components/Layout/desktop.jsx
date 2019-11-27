import React, { useState, useRef, useContext } from "react"
import styled from "@emotion/styled"

import { Post } from "../Post"
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
  padding: 0 50px;
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
  bottom: 0;
  margin: auto;
  color: white;
`

const Panel = styled.div`
  position: relative;
  flex: 1 1 0;
`

const PostWrapper = styled.div`
  padding: 30px;
  overflow-y: scroll;
  height: 100%;
`

export const DesktopLayout = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  const {
    theme: { breakpoints },
  } = useContext(ThemeContext)

  return (
    <Main maxWidth={breakpoints.xl}>
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
            <Post key={post.node.fields.slug} {...post} />
          ))}
        </PostWrapper>
        <SocialLine orientation="vertical" />
      </Panel>
    </Main>
  )
}
