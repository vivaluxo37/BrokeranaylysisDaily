import { Metadata } from 'next';
import MarketNewsPageClient from './MarketNewsPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const title = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') + ' News & Updates';
  
  const description = `Latest ${title.toLowerCase()} covering market trends, analysis, and breaking news for traders and investors.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://brokeranalysisdaily.com/market-news/${slug}`,
    },
  };
}

export default async function MarketNewsPage({ params }: PageProps) {
  const { slug } = await params;
  return <MarketNewsPageClient slug={slug} />;
}