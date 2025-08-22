import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { DataService } from '@/lib/services/DataService';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  icon: string;
  features: string[];
}

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        // Sample pricing plans for Brokeranalysis platform
        const plans: PricingPlan[] = [
          {
            id: "free",
            name: "Free Trader",
            price: 0,
            period: "Forever",
            icon: "📊",
            features: [
              "Basic broker comparisons",
              "Trust score access",
              "Educational content",
              "Community forum access",
              "Email support"
            ]
          },
          {
            id: "pro",
            name: "Pro Trader",
            price: isYearly ? 99 : 12,
            period: isYearly ? "Per Year" : "Per Month",
            icon: "🚀",
            features: [
              "Advanced broker analytics",
              "Real-time market data",
              "Custom alerts & notifications",
              "Portfolio tracking",
              "Priority support",
              "API access",
              "Advanced filtering"
            ]
          },
          {
            id: "enterprise",
            name: "Enterprise",
            price: isYearly ? 499 : 59,
            period: isYearly ? "Per Year" : "Per Month",
            icon: "⭐",
            features: [
              "White-label solutions",
              "Custom integrations",
              "Dedicated account manager",
              "Advanced reporting",
              "Multi-user management",
              "SLA guarantee",
              "Custom development"
            ]
          }
        ];
        setPricingPlans(plans);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, [isYearly]);

  return (
    <section className="section-spacing" id="pricing">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <span className="text-sm text-white/80">Pricing for you</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Choose Your Trading Plan
          </h2>
          <p className="text-body text-white/70 mb-8">
            Get the tools and insights you need to make informed trading decisions.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-white/60'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-white/60'}`}>
              Yearly
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="modern-card-hover animate-pulse">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-white/10 rounded mb-4"></div>
                  <div className="h-8 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-white/10 rounded mb-6"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-white/10 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            pricingPlans.map((plan, index) => (
            <Card 
              key={plan.id} 
              className={`modern-card-hover relative ${
                index === 1 ? 'scale-105 border-purple-500/50' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <CardTitle className="text-white text-xl mb-4">
                  {plan.name}
                </CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-white">
                    ${plan.price}
                  </div>
                  <div className="text-white/60 text-sm">
                    {plan.period}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Button 
                  className={`w-full ${
                    index === 1 ? 'btn-gradient' : 'btn-glass'
                  }`}
                >
                  Get Started
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;