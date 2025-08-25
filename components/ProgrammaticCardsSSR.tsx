import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface ProgrammaticPage {
  slug: string;
  title: string;
  short_answer: string;
  bullet_reasons: string[];
}

interface ProgrammaticCardProps {
  slug: string;
  title: string;
  short_answer: string;
  bullet_reasons: string[];
}

const ProgrammaticCard: React.FC<ProgrammaticCardProps> = ({
  slug,
  title,
  short_answer,
  bullet_reasons
}) => {
  return (
    <Card className="modern-card-hover h-full">
      <CardHeader>
        <CardTitle className="text-white text-lg leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-white/80 text-sm leading-relaxed">
            {short_answer}
          </p>
          
          <ul className="space-y-2">
            {bullet_reasons.map((reason, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">{reason}</span>
              </li>
            ))}
          </ul>

          <Link href={`/${slug}`}>
            <Button 
              size="sm" 
              className="cta-secondary w-full"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Read Full Guide
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProgrammaticCardsSSR: React.FC = () => {
  // Generate programmatic content based on broker specializations
  const programmaticPages: ProgrammaticPage[] = [
    {
      slug: 'best-forex-brokers-usa',
      title: 'Best Forex Brokers for USA Traders',
      short_answer: 'Discover top-rated forex brokers that accept US clients with competitive spreads, strong regulation, and excellent customer support.',
      bullet_reasons: [
        'CFTC and NFA regulated brokers only',
        'Competitive spreads starting from 0.1 pips',
        '24/7 customer support in English',
        'Advanced trading platforms (MT4/MT5)'
      ]
    },
    {
      slug: 'crypto-trading-brokers-guide',
      title: 'Best Crypto Trading Brokers 2024',
      short_answer: 'Find reliable cryptocurrency brokers with low fees, secure custody, and access to major digital assets.',
      bullet_reasons: [
        'Access to 50+ cryptocurrencies',
        'Cold storage security measures',
        'Low trading fees (0.1% - 0.25%)',
        'Institutional-grade security'
      ]
    },
    {
      slug: 'scalping-brokers-comparison',
      title: 'Best Brokers for Scalping Strategies',
      short_answer: 'Specialized brokers offering ultra-low latency, tight spreads, and scalping-friendly policies for high-frequency traders.',
      bullet_reasons: [
        'Sub-millisecond execution speeds',
        'Raw spread accounts available',
        'No restrictions on scalping',
        'Advanced order types (OCO, trailing stops)'
      ]
    },
    {
      slug: 'swing-trading-broker-guide',
      title: 'Top Brokers for Swing Trading',
      short_answer: 'Brokers optimized for swing traders with comprehensive research tools, flexible position sizing, and competitive overnight rates.',
      bullet_reasons: [
        'Advanced charting and analysis tools',
        'Low overnight financing costs',
        'Flexible position sizing options',
        'Economic calendar and market news'
      ]
    },
    {
      slug: 'beginner-friendly-brokers',
      title: 'Best Brokers for Beginner Traders',
      short_answer: 'User-friendly brokers with educational resources, demo accounts, and simplified trading interfaces for new traders.',
      bullet_reasons: [
        'Comprehensive educational materials',
        'Risk-free demo accounts',
        'Intuitive trading platforms',
        'Dedicated beginner support'
      ]
    },
    {
      slug: 'islamic-trading-accounts',
      title: 'Best Islamic Trading Accounts',
      short_answer: 'Sharia-compliant brokers offering swap-free accounts that adhere to Islamic finance principles.',
      bullet_reasons: [
        'No overnight interest charges',
        'Sharia-compliant trading conditions',
        'Certified by Islamic scholars',
        'Full range of trading instruments'
      ]
    }
  ];

  // Generate FAQ JSON-LD for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": programmaticPages.slice(0, 3).map(page => ({
      "@type": "Question",
      "name": page.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${page.short_answer} Key benefits include: ${page.bullet_reasons.join(', ')}.`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-heading-lg text-gradient mb-4">Expert Trading Guides</h2>
            <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
              Comprehensive guides tailored to specific trading strategies, regions, and broker requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmaticPages.map((page) => (
              <ProgrammaticCard key={page.slug} {...page} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/guides">
              <Button className="cta-primary">
                View All Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
