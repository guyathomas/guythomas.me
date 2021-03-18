import React from "react"
import { Page } from "~templates"
import { graphql, Link } from "gatsby"
import { HLocation } from "@reach/router"
import styled from "@emotion/styled"
import { Query } from "~types/gatsby-graphql"
import { BREAKPOINTS } from "~styles"
import { Label, Select } from "@rebass/forms"

interface TheFrontendInterviewProps {
  data: Query
  location: HLocation
}

const QuestionTypeTileWrapper = styled.div``

const QuestionList = styled.div`
  max-width: ${BREAKPOINTS.md}px;
  margin: 0 auto;
`

const QuestionCategoryDescription = styled.p`
  margin-top: 1rem;
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

enum QuestionCategory {
  All = "all",
  BUILD_A_COMPONENT = "build-a-component",
  BUILD_A_CLASS = "build-a-class",
  ALGORITHM_AND_DATA_STRUCTURES = "algorithm-and-data-structures",
  DESIGN_A_COMPONENT = "design-a-component",
  DESIGN_AN_APPLICATION = "design-an-application",
  BEHAVIORAL = "behavioral",
}

const descriptionMap: Record<QuestionCategory, string> = {
  [QuestionCategory.All]: "",
  [QuestionCategory.BUILD_A_COMPONENT]:
    "Your task is to build a UI component. These interviews are typically framework agnostic. You will be evaluated based on your ability to clarify requirements and your ability to existing clean, re-usable code.",
  [QuestionCategory.BUILD_A_CLASS]:
    "Your task is to build a class or function that that performs some specific behavior. These typically replicate functionality that is familiar to you. Examples are a `Promise` class or an `EventEmitter` class.",
  [QuestionCategory.ALGORITHM_AND_DATA_STRUCTURES]: `Typically no more difficult than leetcode medium. Brushing up on trees and things like "find the most frequent element in an array" are suggested.`,
  [QuestionCategory.DESIGN_A_COMPONENT]:
    "Designing the API and how the implementation would work for a specific UI component - for example a `react-select` clone or a `tooltip` component.",
  [QuestionCategory.DESIGN_AN_APPLICATION]:
    "Given a high level spec for a feature you are expected to consider data flows, network requests, navigation flow, etc...",
  [QuestionCategory.BEHAVIORAL]:
    "Questions about past experiences, often dealing with leadership traits, product ownership, conflict resolution with peers and technical decision making processes",
}

const TheFrontendInterview: React.FC<TheFrontendInterviewProps> = ({
  data,
  location: { pathname },
}) => {
  const uniqueCategories = new Set(Object.values(QuestionCategory))
  const [
    selectedCategory,
    setSelectedCategory,
  ] = React.useState<QuestionCategory>(QuestionCategory.All)
  const visibleQuestions = data.allMarkdownRemark.nodes.filter(
    ({ frontmatter }) =>
      selectedCategory === QuestionCategory.All ||
      frontmatter?.category === selectedCategory
  )
  return (
    <Page title="The Frontend Interview">
      <QuestionList>
        <Label htmlFor="category">Question Category</Label>
        <Select
          id="category"
          name="category"
          onChange={(event) => {
            setSelectedCategory(event.target.value as QuestionCategory)
          }}
        >
          {[...uniqueCategories].map((category) => (
            <option key={category}>{category}</option>
          ))}
        </Select>
        {descriptionMap[selectedCategory] && (
          <QuestionCategoryDescription>
            {descriptionMap[selectedCategory]}
          </QuestionCategoryDescription>
        )}
        {visibleQuestions.length ? (
          visibleQuestions.map(({ frontmatter, fields }) => (
            <QuestionTypeTile
              description={frontmatter?.description!}
              link={`${pathname}${fields?.slug}`}
              title={frontmatter?.title!}
              key={fields?.slug!}
            />
          ))
        ) : (
          <h3>No Questions for {selectedCategory}</h3>
        )}
      </QuestionList>
    </Page>
  )
}

export default TheFrontendInterview

export const pageQuery = graphql`
  query TheFrontendInterview {
    allMarkdownRemark(
      filter: {
        fields: { sourceInstanceName: { eq: "the-frontend-interview" } }
        frontmatter: { published: { eq: true } }
      }
    ) {
      nodes {
        fields {
          sourceInstanceName
          slug
        }
        frontmatter {
          title
          category
          description
        }
      }
    }
  }
`
