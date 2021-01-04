import React from "react"
import { graphql } from "gatsby"
import createPersistedState from "use-persisted-state"
import styled from "@emotion/styled"

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

import Resume from "~components/Resume"
import Banner from "~components/Banner"
import ButtonLink from "~components/ButtonLink"
import { ResumeQuery } from "~types/gatsby-graphql"
import { ThemeProvider } from "~context/ThemeProvider"
import { ResumeJSON } from "~components/Resume/Resume"

const STORAGE_KEY = "resume"
const useResumeState = createPersistedState(STORAGE_KEY)
const StyledButtonLink = styled(ButtonLink)`
  margin-left: 1rem;
`
const StyledBanner = styled(Banner)`
  @media only print {
    display: none;
  }
`

const ResumePage: React.FC<{
  data: ResumeQuery
}> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => {
  const [customResume, setCustomResume] = useResumeState<ResumeJSON>()
  const resetChanges = React.useCallback(() => {
    setCustomResume(undefined)
    localStorage?.removeItem(STORAGE_KEY)
  }, [setCustomResume])
  return (
    <ThemeProvider>
      {customResume && (
        <StyledBanner>
          You have modified this resume, but no one else can see the changes.
          <StyledButtonLink onClick={resetChanges}>
            Discard Changes
          </StyledButtonLink>
          <StyledButtonLink
            onClick={() => {
              typeof window !== "undefined" && window.print()
            }}
          >
            Print Resume
          </StyledButtonLink>
        </StyledBanner>
      )}
      <Resume
        resumeData={customResume ? customResume : nodes[0]}
        onSave={(newResume) => {
          setCustomResume(newResume)
        }}
        onReset={resetChanges}
      />
    </ThemeProvider>
  )
}

export default ResumePage
