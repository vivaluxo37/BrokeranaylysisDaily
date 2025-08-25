import { Metadata } from 'next';
import AnalysisPageClient from './AnalysisPageClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const title = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') + ' Analysis';
  
  const description = `Comprehensive ${title.toLowerCase()} guide covering technical and fundamental analysis techniques for traders.`;

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
      canonical: `https://brokeranalysisdaily.com/education/analysis/${slug}`,
    },
  };
}

export default async function AnalysisPage({ params }: PageProps) {
  const { slug } = await params;
  return <AnalysisPageClient slug={slug} />;
}