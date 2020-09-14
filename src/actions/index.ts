const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.guythomas.me"
    : "http://localhost:3000"

export interface Comment {
  id: string
  author: string
  body: string
}

export const actions = {
  getCommentsForSlug: (slug: string) =>
    fetch(`${BASE_URL}/comments/${slug}`).then((res) => res.json()),
  postCommentForSlug: (
    slug: string,
    commentBody: Record<string, any>,
    authToken: string
  ) =>
    fetch(`${BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ ...commentBody, slug }),
    }).then((res) => res.json()),
}
