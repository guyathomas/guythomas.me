import React from "react"
import { Page } from "~templates"
import { graphql, Link } from "gatsby"
import { HLocation } from "@reach/router"
import styled from "@emotion/styled"
import { Query } from "~types/gatsby-graphql"
import { BREAKPOINTS } from "~styles"

interface TheFrontendInterviewProps {
  data: Query
  location: HLocation
}

const QuestionTypeTileWrapper = styled.div``

const SectionGrid = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: 0 auto;
`

interface QuestionTypeTileProps {
  title: string
  link: string
  description: string
}

const QuestionTypeTile: React.FC<QuestionTypeTileProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <QuestionTypeTileWrapper>
      <Link to={link}>
        <h3>{title}</h3>
      </Link>
      <p>{description}</p>
    </QuestionTypeTileWrapper>
  )
}

const TheFrontendInterview: React.FC<TheFrontendInterviewProps> = ({
  data,
  location,
}) => {
  const sections = data.allTheFrontendInterviewYaml.nodes[0].sections || []
  return (
    <Page title="The Frontend Interview">
      <SectionGrid>
        {sections.map((section) => (
          <QuestionTypeTile
            title={section?.title!}
            description={section?.description!}
            link={`${location.pathname}${section?.slug || ""}`}
          />
        ))}
      </SectionGrid>
    </Page>
  )
}

export default TheFrontendInterview

export const pageQuery = graphql`
  query TheFrontendInterview {
    allTheFrontendInterviewYaml {
      nodes {
        sections {
          description
          title
          slug
        }
      }
    }
  }
`
