import React, { useState, useRef } from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"
import result from "lodash/result"
import debounce from "lodash/debounce"

import { Post } from "../components/Post"
import { Bio } from "../components/Bio"
import { Layout } from "../components/Layout"
import { SocialLine } from "../components/SocialLine"
import { SEO } from "../components/Seo"

const HEADER_HEIGHT = "100px"

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
  border-radius: 15px 15px 0 0;
  padding: 20px 10px;
  overflow-y: ${props => (props.allowScrolling ? "scroll" : "hidden")};
  height: calc(100vh - ${HEADER_HEIGHT});
`

const CardWrapper = styled.div`
  scroll-snap-align: start;
  padding-top: ${HEADER_HEIGHT};
`

const InitialCardOffset = styled.div`
  height: 40vh;
  scroll-snap-align: start;
`

const BlogIndex = ({ data }) => {
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
    <Layout onScroll={handleScroll}>
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
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
