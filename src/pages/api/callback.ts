export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    const msg = error ?? 'missing_code';
    return new Response(renderScript('error', { message: msg }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const resp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.GITHUB_CLIENT_ID,
        client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = (await resp.json()) as { access_token?: string; error?: string };

    if (!data.access_token) {
      throw new Error(data.error ?? 'no_token');
    }

    return new Response(renderScript('success', { token: data.access_token, provider: 'github' }), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return new Response(renderScript('error', { message }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
};

function renderScript(status: 'success' | 'error', data: Record<string, string>) {
  const payload = JSON.stringify(data);
  const prefix = `authorization:github:${status}`;

  return /* html */ `<!DOCTYPE html>
<html>
<head><title>Autenticando...</title></head>
<body>
<p>Autenticando, aguarde...</p>
<script>
  (function () {
    function receiveMessage(e) {
      window.removeEventListener('message', receiveMessage, false);
      window.opener.postMessage('${prefix}:${payload}', e.origin);
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body>
</html>`;
}
