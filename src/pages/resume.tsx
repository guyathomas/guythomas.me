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
          details
        }
        education {
          date
          company
          title
          details
        }
        avatar
        firstName
        lastName
      }
    }
  }
`

import Resume, { ResumeBanner, ResumeBannerButton } from "~components/Resume"

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
  const [isEditing, setIsEditing] = React.useState(false)
  const resetChanges = React.useCallback(() => {
    setCustomResume(undefined)
    localStorage?.removeItem(STORAGE_KEY)
  }, [setCustomResume])
  return (
    <ThemeProvider>
      {!isEditing && customResume && (
        <ResumeBanner>
          You have modified this resume, but no one else can see the changes.
          <ResumeBannerButton onClick={resetChanges}>
            Discard Changes
          </ResumeBannerButton>
          <ResumeBannerButton
            onClick={() => {
              typeof window !== "undefined" && window.print()
            }}
          >
            Print Resume
          </ResumeBannerButton>
        </ResumeBanner>
      )}
      <Resume
        resumeData={customResume ? customResume : nodes[0]}
        onSave={(newResume) => {
          setCustomResume(newResume)
        }}
        onReset={resetChanges}
        onEdit={setIsEditing}
      />
    </ThemeProvider>
  )
}

export default ResumePage
