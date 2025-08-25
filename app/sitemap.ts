import { MetadataRoute } from 'next'
import { BrokerService } from '@/lib/services/brokerService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://brokeranalysis.com'
  
  // Static pages
  const staticPages = [
    '',
    '/brokers',
    '/compare',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/calculator',
    '/ai',
    '/dashboard',
    '/brokers/reviews',
    '/brokers/countries',
    '/brokers/platforms',
    '/brokers/account-types'
  ]

  // Strategy definitions for programmatic SEO
  const strategies = ['scalping', 'day-trading', 'swing-trading', 'long-term', 'algorithmic']
  const countries = ['us', 'uk', 'au', 'ca', 'de', 'ph']
  const platforms = ['mt4', 'mt5', 'ctrader', 'tradingview', 'webtrader', 'mobile', 'proprietary']
  const accountTypes = ['ecn', 'stp', 'islamic', 'micro', 'vip', 'demo']

  const sitemap: MetadataRoute.Sitemap = []

  // Add static pages
  staticPages.forEach(page => {
    sitemap.push({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' || page === '/brokers' ? 'daily' : 'weekly',
      priority: page === '' ? 1.0 : page === '/brokers' ? 0.9 : 0.8
    })
  })

  // Add strategy × country combinations (programmatic SEO)
  strategies.forEach(strategy => {
    countries.forEach(country => {
      sitemap.push({
        url: `${baseUrl}/${strategy}/brokers/${country}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      })
    })
  })

  // Add country-specific broker pages
  countries.forEach(country => {
    sitemap.push({
      url: `${baseUrl}/brokers/country/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    })
  })

  // Add platform-specific broker pages
  platforms.forEach(platform => {
    sitemap.push({
      url: `${baseUrl}/brokers/platform/${platform}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    })
  })

  // Add account type-specific broker pages
  accountTypes.forEach(type => {
    sitemap.push({
      url: `${baseUrl}/brokers/account-type/${type}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    })
  })

  try {
    // Add individual broker pages
    const brokers = await BrokerService.getBrokers(100, 0)
    brokers.forEach(broker => {
      sitemap.push({
        url: `${baseUrl}/brokers/${broker.slug}`,
        lastModified: new Date(broker.updated_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6
      })
    })

    // Add blog posts (if we have them)
    // const articles = await ArticleService.getArticles(100, 0)
    // articles.forEach(article => {
    //   sitemap.push({
    //     url: `${baseUrl}/blog/${article.slug}`,
    //     lastModified: new Date(article.updated_at || article.published_at || new Date()),
    //     changeFrequency: 'monthly',
    //     priority: 0.5
    //   })
    // })
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error)
  }

  return sitemap
}
