import { NextResponse } from 'next/server';
import { SITE_ROUTES } from '@/lib/routes';

export const runtime = 'edge';

export async function GET() {
  const items = SITE_ROUTES.map(route => `
    <item>
      <title>${route.title}</title>
      <link>${`https://chaosnet.local${route.path}`}</link>
      <guid>${`https://chaosnet.local${route.path}`}</guid>
      <description>${route.description || 'A chaos testing page'}</description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>ChaosNet Test Feed</title>
      <link>https://chaosnet.local</link>
      <description>Real-time updates of the ChaosNet testing suite traps</description>
      <language>en-us</language>
      <atom:link href="https://chaosnet.local/feed.xml" rel="self" type="application/rss+xml" />
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
