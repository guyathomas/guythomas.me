import React from "react"
import { Maybe } from "~types/gatsby-graphql"
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
  onChange?: (value: string) => void
  innerHTML?: string
}

const TimelineOuter = styled.div`
  position: relative;
  & > div {
    display: grid;
    grid-template-columns: 1fr;
    @media ${DESKTOP} {
      grid-gap: 2rem;
      grid-template-columns: 1fr 2fr;
    }
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

const RemoveSection = styled(SectionButton)`
  position: absolute;
  right: 14px;
  top: 30px;
  @media ${DESKTOP} {
    right: -50px;
    top: 20px;
  }
`
const Timeline: React.FC<TimelineProps> = ({
  date,
  company,
  title,
  detailItems = [],
  className = "",
  contentEditable = false,
  onRemove,
  onChange,
  innerHTML,
}) => {
  const [initialHTML] = React.useState(innerHTML)
  const test = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (contentEditable && onChange) {
      onChange(test.current?.innerHTML || "")
    }
    // I don't want to force the memoization of onChange.
    // Including in this array will cause an infinite loop since it changes on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditable, test])

  const content = initialHTML ? null : (
    <>
      <TimelineTitles>
        {date && <TimelineDate>{date}</TimelineDate>}
        {company && <TimelineCompany>{company}</TimelineCompany>}
        {title && <TimelineTitle>{title}</TimelineTitle>}
      </TimelineTitles>
      <TimelineDetails>
        <TimelineList>
          {detailItems.map((bullet) => (
            <TimelineListItem key={String(bullet)}>{bullet}</TimelineListItem>
          ))}
        </TimelineList>
      </TimelineDetails>
    </>
  )

  return (
    <TimelineOuter className={className}>
      {contentEditable && (
        <RemoveSection onClick={onRemove} actionType="negative">
          -
        </RemoveSection>
      )}
      <div
        ref={test}
        contentEditable={contentEditable}
        onInput={(event) => {
          if (onChange) onChange(event.currentTarget.innerHTML)
        }}
        dangerouslySetInnerHTML={
          initialHTML
            ? {
                __html: initialHTML,
              }
            : undefined
        }
      >
        {content}
      </div>
    </TimelineOuter>
  )
}

export default Timeline
