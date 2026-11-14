import { geoFromHeaders } from '../src/light/geo';

/**
 * Tells the page roughly where the viewer is, so the window light can follow
 * their sun. Uses only the location Vercel derives from the request; nothing
 * is stored or logged.
 */
export function GET(request: Request): Response {
  return new Response(JSON.stringify(geoFromHeaders(request.headers)), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store',
    },
  });
}
