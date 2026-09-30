import { MetadataRoute } from 'next';
import { SITE_ROUTES } from '@/lib/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://test-website.pages.dev';

  return SITE_ROUTES.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastmod: new Date(),
    changefreq: 'weekly',
    priority: route.path === '/' ? 1 : 0.7,
  }));
}
