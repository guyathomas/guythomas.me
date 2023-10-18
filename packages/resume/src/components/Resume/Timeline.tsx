import React from "react"

import styled from "@emotion/styled"
import { DESKTOP } from "./constants"

interface TimelineProps {
  title?: string
  date?: string
  company?: string
  details?: string
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

const TimelineCompany = styled.h3`
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  p {
    margin-bottom: 0;
  }
`
const TimelineTitle = styled.h4`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline;
  }
`

const TimelineDate = styled.h3`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline;
    margin-left: 1rem;
  }
`

const TimelineDetailsContent = styled.div`
  & li {
    @media only print {
      font-size: 85%;
      margin-bottom: 0.5rem;
    }
  }
  & ul {
    margin-left: 0;
    margin-top: 1rem;
    padding-left: 0.5rem;
    list-style-position: outside;
    @media only print {
      margin-bottom: 0;
      margin-top: 0.5rem;
    }
  }
`

const Timeline: React.FC<TimelineProps> = ({
  date,
  company,
  title,
  details,
}) => {
  return (
    <TimelineOuter>
      <TimelineTitles>
        {company && (
          <TimelineCompany dangerouslySetInnerHTML={{ __html: company }} />
        )}
        {title && <TimelineTitle dangerouslySetInnerHTML={{ __html: title }} />}
        {date && <TimelineDate>{date}</TimelineDate>}
      </TimelineTitles>
      <TimelineDetails>
        {details && (
          <TimelineDetailsContent
            dangerouslySetInnerHTML={{ __html: details }}
          />
        )}
      </TimelineDetails>
    </TimelineOuter>
  )
}

export default Timeline
