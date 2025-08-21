import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    description: "Comprehensive analysis of spreads, fees, and performance metrics across all major brokers.",
    cta: "Learn More"
  },
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description: "Advanced algorithms match your trading style with the most suitable brokers for optimal results.",
    cta: "Try AI Assistant"
  },
  {
    icon: ShieldCheck,
    title: "Trusted Reviews",
    description: "Verified user reviews and regulatory compliance checks ensure you trade with confidence.",
    cta: "View Trust Scores"
  }
];

const stats = [
  { value: "2GB+", label: "Broker Data" },
  { value: "50K+", label: "User Reviews" },
  { value: "95%", label: "Answer Accuracy" }
];

export const WhyBrokeranalysis: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Why Brokeranalysis</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            The most comprehensive broker analysis platform powered by AI and backed by real data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="modern-card-hover text-center">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">{feature.description}</p>
                  <Button className="cta-secondary">
                    {feature.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};