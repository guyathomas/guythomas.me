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
          subtitle
          detailItems
        }
        education {
          date
          company
          title
          detailItems
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
import { ThemeProvider } from "~templates"

const ResumePage: React.FC<{
  data: ResumeQuery
}> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => (
  <ThemeProvider>
    <Resume resumeData={nodes[0]} />
  </ThemeProvider>
)

export default ResumePage
