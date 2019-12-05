import React from "react"

import { PostSnippit } from "../components/PostSnippit"
import { Bio } from "../components/Bio"
import { SocialLine } from "../components/SocialLine"
import { SEO } from "../components/Seo"
import { Layout, LayoutContext } from "../components/Layout"
import Test from "."

export default props => <Test {...props} focusMode />

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
