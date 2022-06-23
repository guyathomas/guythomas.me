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
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider } from "~context/ThemeProvider";
import { ResumeJSON } from "~components/Resume/Resume"


const STORAGE_KEY = "resume"
const useResumeState = createPersistedState(STORAGE_KEY)

function useEyebrowDismissedState<T = any>(): [value: T | undefined, hideEyebrow: (newValue: T | undefined) => void] {
  let value: T | undefined = undefined;
  try {
    const storedValue = globalThis.localStorage.getItem(STORAGE_KEY)
    if (storedValue) {
      value = JSON.parse(storedValue)
    }
  } catch { }
  const setValue = React.useCallback((newValue: T | undefined) => {
    try {
      if (newValue) {
        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue))
      } else if (newValue === undefined) {
        // Setting to undefined will remove the value
        globalThis.localStorage.removeItem(STORAGE_KEY)
      }
    } catch { }
  }, [])
  return [value, setValue]
}


const ResumePage: React.FC<{
  data: ResumeQuery
}> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => {
    const [customResume, setCustomResume] = useEyebrowDismissedState<ResumeJSON>()
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
