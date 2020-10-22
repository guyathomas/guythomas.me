import { graphql } from "gatsby"

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
          subtitle
          detailItems
        }
        education {
          date
          company
          title
          detailItems
        }
        avatar
        firstName
        lastName
      }
    }
  }
`

export { default } from "components/Resume"
