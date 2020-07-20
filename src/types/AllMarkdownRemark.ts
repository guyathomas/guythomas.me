import { MarkdownRemarkFields, MarkdownRemark } from "./gatsby-graphql"

export interface AllMarkdownRemark {
  node: MarkdownRemark
  fields: MarkdownRemarkFields
}
