import React, { useEffect, createContext, useState } from "react"
import debounce from "lodash/debounce"

import { PostSnippit } from "../components/PostSnippit"
import { Bio } from "../components/Bio"
import { SocialLine } from "../components/SocialLine"
import { SEO } from "../components/Seo"
import { MobileLayout, DesktopLayout } from "../components/Layout"

const theme = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    max: 1440,
  },
}

export const ThemeContext = createContext(theme)

export default props => {
  const [screenSize, setScreenSize] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(null)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const debouncedSetScreen = debounce(() => {
    const { screen } = window
    setScreenSize(screen)
    setIsMobile(screen.width < theme.breakpoints.md)
  }, 100)

  useEffect(() => {
    debouncedSetScreen()
    window.addEventListener("resize", debouncedSetScreen)
    return () => window.removeEventListener("resize", debouncedSetScreen)
  }, [debouncedSetScreen])

  if (isLoading || typeof isMobile !== "boolean") return <div>Loading</div>
  const posts = props.data.allMarkdownRemark.edges
  
  return (
    <ThemeContext.Provider value={{ theme, screenSize, isMobile }}>
      {isMobile ? (
        <MobileLayout {...props}>
          <SEO title="All posts" />
          <Bio />
          <SocialLine />
          <main>
            {posts.map(post => (
              <PostSnippit key={post.node.fields.slug} {...post} />
            ))}
          </main>
        </MobileLayout>
      ) : (
        <DesktopLayout {...props} />
      )}
    </ThemeContext.Provider>
  )
}

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
