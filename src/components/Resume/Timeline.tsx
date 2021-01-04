import React from "react"
import ContentEditable from "react-contenteditable"

import {
  ResumeYamlExperience,
  ResumeYamlEducation,
  Maybe,
} from "~types/gatsby-graphql"

import styled from "@emotion/styled"
import { DESKTOP } from "./constants"
import { SectionButton } from "./styles"

interface TimelineProps {
  date?: string
  company?: string
  title?: string
  detailItems?: Maybe<string>[]
  className?: string
  contentEditable?: boolean
  onRemove?: () => void
  onChange?: (fieldValue: TimelineFieldNames, value: string) => void
}

const TimelineOuter = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  @media ${DESKTOP} {
    grid-gap: 2rem;
    grid-template-columns: 1fr 2fr;
  }
`

const TimelineTitles = styled.div``
const TimelineDetails = styled.div``

// eslint-disable-next-line
// @ts-ignore
const TimelineCompany = styled(ContentEditable)`
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
// eslint-disable-next-line
// @ts-ignore
const TimelineTitle = styled(ContentEditable)`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

// eslint-disable-next-line
// @ts-ignore
const TimelineDate = styled(ContentEditable)`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

// eslint-disable-next-line
// @ts-ignore
const TimelineListItem = styled(ContentEditable)`
  @media only print {
    font-size: 85%;
    margin-bottom: 0.5rem;
  }
`

const TimelineList = styled.ul`
  margin-left: 0;
  margin-top: 1rem;
  padding-left: 0.5rem;
  list-style-position: outside;
  @media only print {
    margin-bottom: 0;
    margin-top: 0.5rem;
  }
`

const RemoveSection = styled(SectionButton)`
  position: absolute;
  right: 14px;
  top: 30px;
  @media ${DESKTOP} {
    right: -50px;
    top: 20px;
  }
`

type TimelineFieldNames = keyof ResumeYamlEducation | keyof ResumeYamlExperience

const Timeline: React.FC<TimelineProps> = ({
  date = "",
  company = "",
  title = "",
  detailItems = [],
  className = "",
  contentEditable = false,
  onRemove,
  onChange,
}) => {
  return (
    <TimelineOuter className={className}>
      {contentEditable && (
        <RemoveSection onClick={onRemove} actionType="negative">
          -
        </RemoveSection>
      )}
      <TimelineTitles>
        <TimelineCompany
          html={company}
          disabled={!contentEditable}
          onChange={(event) => {
            if (onChange) {
              onChange("company", event.target.value)
            }
          }}
          tagName="h3"
        />
        <TimelineDate
          html={date}
          disabled={!contentEditable}
          onChange={(event) => {
            if (onChange) {
              onChange("date", event.target.value)
            }
          }}
          tagName="h3"
        />
        <TimelineTitle
          html={title}
          disabled={!contentEditable}
          onChange={(event) => {
            if (onChange) {
              onChange("title", event.target.value)
            }
          }}
          tagName="h4"
        />
      </TimelineTitles>
      <TimelineDetails>
        <TimelineList>
          {detailItems.map((bullet, index) => (
            <TimelineListItem
              html={String(bullet)}
              disabled={!contentEditable}
              onChange={(event) => {
                if (onChange) {
                  // eslint-disable-next-line
                  // @ts-ignore
                  onChange(`detailItems[${index}]`, event.target.value)
                }
              }}
              tagName="li"
              key={index}
            />
          ))}
        </TimelineList>
      </TimelineDetails>
    </TimelineOuter>
  )
}

export default Timeline
