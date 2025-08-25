import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/private/',
        '/_next/',
        '/static/',
        '*.json',
        '/search?*'
      ],
    },
    sitemap: 'https://brokeranalysis.com/sitemap.xml',
  }
}
