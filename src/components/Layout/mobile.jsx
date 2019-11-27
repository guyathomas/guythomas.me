import React, { useState, useRef } from "react"
import styled from "@emotion/styled"
import result from "lodash/result"
import debounce from "lodash/debounce"

import { Post } from "../Post"
import { Bio } from "../Bio"
import { SocialLine } from "../SocialLine"
import { SEO } from "../Seo"
import "./style.css"

const Main = styled.main`
  scroll-snap-type: y mandatory;
  height: 100vh;
  overflow-y: scroll;
`

const Portrait = styled.div`
  position: fixed;
  background-image: url("https://res.cloudinary.com/dqvlfpaev/image/upload/v1574619573/cropped-black-and-white-portrait_cir0bd.png");
  background-repeat: no-repeat;
  width: 100%;
  height: 80vh;
  background-size: cover;
  background-position: center;
`

const Card = styled.div`
  background-color: white;
  position: relative;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 0.5rem;
  overflow-y: ${props => (props.allowScrolling ? "scroll" : "hidden")};
  height: 100vh;
  &::after {
    content: '';
    height: 3px;
    width: 3rem;
    background-color: lightgray;
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
  }
`

const CardWrapper = styled.div`
  scroll-snap-align: start;
`

const InitialCardOffset = styled.div`
  height: 70vh;
  scroll-snap-align: start;
`

export const MobileLayout = ({ data }) => {
  const posts = data.allMarkdownRemark.edges
  const [allowCardScrolling, setAllowCardScrolling] = useState(false)
  const cardWrapperEl = useRef(null)

  const handleScroll = debounce(() => {
    const clientRect = result(cardWrapperEl, "current.getBoundingClientRect")
    if (!clientRect) return
    clientRect.top <= 1
      ? setAllowCardScrolling(true)
      : setAllowCardScrolling(false)
  }, 100)
  return (
    <Main onScroll={handleScroll}>
      <SEO title="All posts" />
      <Portrait />
      <InitialCardOffset />
      <CardWrapper ref={cardWrapperEl}>
        <Card allowScrolling={allowCardScrolling}>
          <Bio />
          <SocialLine />
          <main>
            {posts.map(post => (
              <Post key={post.node.fields.slug} {...post} />
            ))}
          </main>
        </Card>
      </CardWrapper>
    </Main>
  )
}