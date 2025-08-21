import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { mockQuery } from '@/app/homepageMockData';

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

          <Button 
            size="sm" 
            className="cta-secondary w-full"
            onClick={() => window.open(`/program/${slug}`, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Read Full Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProgrammaticCards: React.FC = () => {
  // Generate FAQ JSON-LD for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": mockQuery.programmaticPages[0].title,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${mockQuery.programmaticPages[0].short_answer} Key benefits include: ${mockQuery.programmaticPages[0].bullet_reasons.join(', ')}.`
        }
      }
    ]
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
            {mockQuery.programmaticPages.map((page) => (
              <ProgrammaticCard key={page.slug} {...page} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button className="cta-primary">
              View All Guides
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};