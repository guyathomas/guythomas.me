const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://guythomas-me-api.herokuapp.com"
    : "http://localhost:3000"

export interface Comment {
  id: string
  author: string
  body: string
}

export const actions = {
  getCommentsForSlug: (slug: string) =>
    fetch(`${BASE_URL}/comments/${slug}`).then((res) => res.json()),
  postAuth0Login: (authToken: string) =>
    fetch(`${BASE_URL}/login/auth0`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }).then((res) => res.json()),
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
