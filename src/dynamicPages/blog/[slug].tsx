import React from "react"
import { graphql } from "gatsby"

import { actions, Comment } from "~actions"
import { GlobalLayout, Basic } from "~templates"
import { SEO } from "~components/SEO"
import { PostBySlugQuery, SitePageContext } from "~types/gatsby-graphql"
import { useAuth0 } from "@auth0/auth0-react"

interface PostProps {
  data: PostBySlugQuery
  pageContext: SitePageContext
}

interface CommentInputProps {
  refetch: () => Promise<void>
  slug: string
}
interface CommentsProps {
  slug: string
}
const CommentInput: React.FC<CommentInputProps> = ({ refetch, slug }) => {
  const { loginWithPopup, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [newComment, setNewComment] = React.useState("")

  const onSubmit = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.GATSBY_AUTH0_AUDIENCE_GUYTHOMAS_API,
      })
      await actions.postCommentForSlug(slug, { body: newComment }, accessToken)
      setNewComment("")
      await refetch()
    } catch (error) {
      console.error(error)
    }
  }
  if (!isAuthenticated) {
    const onClick = async () => {
      await loginWithPopup({
        audience: process.env.GATSBY_AUTH0_AUDIENCE_GUYTHOMAS_API,
      })
    }
    return <button onClick={onClick}>Log In To Comment</button>
  }
  return (
    <>
      <input
        value={newComment}
        onChange={(event) => {
          setNewComment(event.target.value)
        }}
      />
      <button
        onClick={onSubmit}
        disabled={newComment.length === 0 && newComment.length > 255}
      >
        Save Comment
      </button>
    </>
  )
}

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const [comments, setComments] = React.useState<Comment[]>([])

  const fetchComments = React.useCallback(async () => {
    try {
      const newComments = (await actions.getCommentsForSlug(slug)) as Comment[]
      setComments(newComments)
    } catch (error) {
      console.error(error)
    }
  }, [slug])

  React.useEffect(() => {
    void fetchComments()
  }, [fetchComments])

  return (
    <>
      <CommentInput refetch={fetchComments} slug={slug} />
      {comments.map(({ author, body, id }) => (
        <li key={id}>
          {author}: {body}
        </li>
      ))}
    </>
  )
}

const Post: React.FC<PostProps> = ({
  pageContext: { slug },
  data: { markdownRemark: post },
}) => {
  // The slug returned here has a slash before and after the string we want, i.e. /some-slug/.
  // Lets get rid of these, but don't remove all slashes, since we may eventually want nested slugs
  // This will always exist, but default to make TS happy :)
  const cleanedSlug = slug?.slice(1, -1) || ""
  return (
    <GlobalLayout>
      <SEO
        title={`${post?.frontmatter?.title || ""}`}
        description={post?.frontmatter?.description || post?.excerpt || ""}
      />
      <Basic title={post?.frontmatter?.title || ""}>
        <article>
          <section dangerouslySetInnerHTML={{ __html: post?.html || "" }} />
        </article>
        <Comments slug={cleanedSlug} />
      </Basic>
    </GlobalLayout>
  )
}

export default Post

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
