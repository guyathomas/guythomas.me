import React from "react"
import { graphql } from "gatsby"
import createPersistedState from "use-persisted-state"

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
import { ThemeProvider } from "~context/ThemeProvider"
import { ResumeJSON } from "~components/Resume/Resume"

const STORAGE_KEY = "resume"
const useResumeState = createPersistedState(STORAGE_KEY)

const ResumePage: React.FC<{
  data: ResumeQuery
}> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => {
  const [customResume, setCustomResume] = useResumeState<ResumeJSON>()
  return (
    <ThemeProvider>
      <Resume
        resumeData={customResume ? customResume : (nodes[0] as ResumeJSON)}
        onSave={(newResume) => {
          setCustomResume(newResume)
        }}
        onReset={() => {
          setCustomResume(undefined)
          localStorage?.removeItem(STORAGE_KEY)
        }}
      />
    </ThemeProvider>
  )
}

export default ResumePage
