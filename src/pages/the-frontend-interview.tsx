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
}) => {
  const uniqueCategories = new Set([
    "all",
    ...data.allMarkdownRemark.nodes
      .map((node) => node?.frontmatter?.category)
      .filter(Boolean),
  ])
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  const visibleQuestions = data.allMarkdownRemark.nodes.filter(
    ({ frontmatter }) =>
      selectedCategory === "all" || frontmatter?.category === selectedCategory
  )
  return (
    <Page title="The Frontend Interview">
      <QuestionList>
        <Label htmlFor="category">Question Category</Label>
        <Select
          id="category"
          name="category"
          onChange={(event) => {
            setSelectedCategory(event.target.value)
          }}
        >
          {[...uniqueCategories].map((category) => (
            <option key={category}>{category}</option>
          ))}
        </Select>
        {visibleQuestions.length ? (
          visibleQuestions.map(({ frontmatter, fields }) => (
            <QuestionTypeTile
              description={frontmatter?.description!}
              link={fields?.slug!}
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
