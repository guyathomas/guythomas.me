import React from "react"
import { graphql } from "gatsby"

export const pageQuery = graphql`
  query Resume {
    allResumeYaml {
      nodes {
        id
        version
        tagline
        contact {
          title
          value {
            html
          }
        }
        intro {
          __typename
          html
        }
        experience {
          title
          date
          company
          details {
            html
          }
        }
        education {
          title {
            html
          }
          subtitle
          details {
            html
          }
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
