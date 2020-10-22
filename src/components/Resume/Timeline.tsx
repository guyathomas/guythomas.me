import React from "react"
import { Maybe } from "~types/gatsby-graphql"
import styled from "@emotion/styled"
import { DESKTOP } from "./constants"

interface TimelineProps {
  date?: string
  company?: string
  title?: string
  subtitle?: string
  detailItems?: Maybe<string>[]
  className?: string
}

const TimelineOuter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media ${DESKTOP} {
    grid-gap: 2rem;
    grid-template-columns: 1fr 2fr;
  }
`

const TimelineTitles = styled.div``
const TimelineDetails = styled.div``

const TimelineDate = styled.h5`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineCompany = styled.h3`
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineTitle = styled.h4`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineSubtitle = styled.span`
  font-style: italic;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const TimelineListItem = styled.li`
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

const Timeline: React.FC<TimelineProps> = ({
  date,
  company,
  title,
  subtitle,
  detailItems = [],
  className = "",
}) => (
  <TimelineOuter className={className}>
    <TimelineTitles>
      {date && <TimelineDate>{date}</TimelineDate>}
      {company && <TimelineCompany>{company}</TimelineCompany>}
      {title && <TimelineTitle>{title}</TimelineTitle>}
      {subtitle && <TimelineSubtitle>{subtitle}</TimelineSubtitle>}
    </TimelineTitles>
    <TimelineDetails>
      <TimelineList>
        {detailItems.map((bullet) => (
          <TimelineListItem key={String(bullet)}>{bullet}</TimelineListItem>
        ))}
      </TimelineList>
    </TimelineDetails>
  </TimelineOuter>
)

export default Timeline
