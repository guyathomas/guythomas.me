/**
 * Tells the page roughly where the viewer is, so the window light can follow
 * their sun. Uses only the location Vercel derives from the request, coarsened
 * to a tenth of a degree (about ten kilometres). Nothing is stored or logged.
 *
 * Self-contained on purpose: Vercel compiles this file on its own. It lives at
 * the repository root because that is where the site deploys from, and Vercel
 * only looks for functions there. Its tests are in packages/resume/api.
 */

function coordinate(raw: string | null, limit: number): number | undefined {
  if (raw === null || raw.trim() === '') return undefined;
  const value = Number(raw);
  return Number.isFinite(value) && Math.abs(value) <= limit ? Math.round(value * 10) / 10 : undefined;
}

export function GET(request: Request): Response {
  const latitude = coordinate(request.headers.get('x-vercel-ip-latitude'), 90);
  const longitude = coordinate(request.headers.get('x-vercel-ip-longitude'), 180);
  const zone = request.headers.get('x-vercel-ip-timezone');
  const reply: { latitude?: number; longitude?: number; timeZone?: string } = {};
  if (latitude !== undefined && longitude !== undefined) {
    reply.latitude = latitude;
    reply.longitude = longitude;
  }
  if (zone && /^[A-Za-z_+\-/0-9]{1,64}$/.test(zone)) reply.timeZone = zone;
  return new Response(JSON.stringify(reply), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store',
    },
  });
}
