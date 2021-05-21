import React from "react"
import { Link } from "~components/Link"
import styled from "@emotion/styled"
import { BREAKPOINTS } from "~styles"

interface SummaryItemProps {
  time: string
  title: string
  link: string
  body: string
}

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
`

const Time = styled.time`
  text-transform: uppercase;
  font-size: 0.8rem;
`

const Snippet = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: auto;
`

export const SummaryItem: React.FC<SummaryItemProps> = ({
  time,
  title,
  body,
  link,
}) => {
  return (
    <Snippet key={link}>
      <div>
        <Time>{time}</Time>
        <Title>
          <Link to={link}>{title}</Link>
        </Title>
      </div>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: body,
          }}
        />
      </section>
    </Snippet>
  )
}
