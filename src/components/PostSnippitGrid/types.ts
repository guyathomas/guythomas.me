import {
  Maybe,
  MarkdownRemark,
  MarkdownRemarkFields,
  MarkdownRemarkFrontmatter,
} from "~types/gatsby-graphql"

export type Post = {
  node: Pick<MarkdownRemark, "excerpt"> & {
    fields?: Maybe<Pick<MarkdownRemarkFields, "slug" | "sourceInstanceName">>
    frontmatter?: Maybe<
      Pick<MarkdownRemarkFrontmatter, "date" | "title" | "description">
    >
  }
}
