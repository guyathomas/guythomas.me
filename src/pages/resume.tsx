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
import { ThemeProvider, Theme, StyledEngineProvider } from "~context/ThemeProvider";
import { ResumeJSON } from "~components/Resume/Resume"


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


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
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
  );
}

export default ResumePage
