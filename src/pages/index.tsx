import React from "react"
import { graphql } from "gatsby"

export const pageQuery = graphql`
  query Resume {
    allResumeYaml {
      nodes {
        id
        version
        tagline
        intro
        contactDetails
        experience {
          date
          company
          title
          details
        }
        education {
          company
          title
          details
        }
        bookList {
          title
          link
        }
        avatar
        firstName
        lastName
      }
    }
  }
`

import Resume from "~components/Resume"

import { ResumeQuery } from "~types/gatsby-graphql"
import { StyledEngineProvider } from "@mui/material/styles"
import { ThemeProvider } from "~context/ThemeProvider"

const ResumePage: React.FC<{
  data: ResumeQuery
}> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <Resume resumeData={nodes[0]} />
    </ThemeProvider>
  </StyledEngineProvider>
)

export default ResumePage
