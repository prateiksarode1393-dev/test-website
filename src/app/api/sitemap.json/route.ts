import { NextResponse } from 'next/server';
import { SITE_ROUTES } from '@/lib/routes';

export async function GET() {
  const baseUrl = 'https://chaosnet.local';

  return NextResponse.json({
    baseUrl,
    total_routes: SITE_ROUTES.length,
    routes: SITE_ROUTES.map(route => ({
      path: route.path,
      title: route.title,
      url: `${baseUrl}${route.path}`
    })),
    generated_at: new Date().toISOString()
  });
}
