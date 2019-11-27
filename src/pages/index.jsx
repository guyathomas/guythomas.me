import React, { useEffect, createContext, useState} from "react"
import debounce from 'lodash/debounce';

import { MobileLayout, DesktopLayout } from "../components/Layout"


const theme = {
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
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
    const { screen } = window;
    setScreenSize(screen)
    setIsMobile(screen.width < theme.breakpoints.md)
  }, 100)

  useEffect(() => {
    debouncedSetScreen();
    window.addEventListener("resize", debouncedSetScreen)
    return () => window.removeEventListener("resize", debouncedSetScreen)
  }, [debouncedSetScreen])

  if (isLoading || typeof isMobile !== 'boolean') return <div>Loading</div>
  
  return (
    <ThemeContext.Provider value={{ theme, screenSize, isMobile }}>
      { isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
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
