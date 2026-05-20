export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://euteindico.com';
  const redirectUri = `${siteUrl}/api/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    response_type: 'code',
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};
