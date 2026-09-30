import { MetadataRoute } from 'next';
import { SITE_ROUTES } from '@/lib/routes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chaosnet.local';

  return SITE_ROUTES.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route.description ? 0.9 : 0.7,
  }));
}
