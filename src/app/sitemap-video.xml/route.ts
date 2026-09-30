import { NextResponse } from 'next/server';
import { SITE_ROUTES } from '@/lib/routes';

export const runtime = 'edge';

export async function GET() {
  const baseUrl = 'https://chaosnet.local';

  const videoRoutes = [
    { url: `${baseUrl}/test/media/native`, title: 'Native Media', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { url: `${baseUrl}/test/media/mixed`, title: 'Mixed Media Hub', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.webm' },
    { url: `${baseUrl}/test/media/vault`, title: 'Asset Vault', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    ${videoRoutes.map(v => `
      <url>
        <loc>${v.url}</loc>
        <video:video>
          <video:thumbnail_loc>https://chaosnet.local/favicon.ico</video:thumbnail_loc>
          <video:title>${v.title}</video:title>
          <video:description>ChaosNet Media Test Asset</video:description>
          <video:content_loc>${v.videoUrl}</video:content_loc>
        </video:video>
      </url>
    `).join('')}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
