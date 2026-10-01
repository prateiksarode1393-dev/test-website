export async function onRequest(context) {
  const { request, params } = context;
  const status = params.status;

  if (!status || isNaN(parseInt(status))) {
    return new Response('Invalid Status', { status: 400 });
  }

  const statusCode = parseInt(status);
  if (statusCode < 100 || statusCode > 599) {
    return new Response('Status code out of range', { status: 400 });
  }

  // We attempt to fetch the "pretty" UI page from the static assets
  // Cloudflare Functions can fetch from the same origin
  const url = new URL(request.url);
  const uiPath = `/test/http/ui/${status}`;
  
  try {
    const response = await fetch(`${url.origin}${uiPath}`);
    if (response.ok) {
      const body = await response.text();
      return new Response(body, { 
        status: statusCode,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  } catch (e) {
    console.error('Failed to fetch UI page:', e);
  }

  // Fallback if UI page is missing
  return new Response(`HTTP Status ${statusCode}`, { 
    status: statusCode,
    headers: { 'Content-Type': 'text/plain' }
  });
}
