import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink, Code, BarChart } from 'lucide-react';

export const EnterpriseCTA: React.FC = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Main Enterprise Banner */}
        <Card className="modern-card border-white/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
                  <Building className="w-4 h-4 mr-2 text-white/80" />
                  <span className="text-sm text-white/80">Enterprise Solutions</span>
                </div>
                
                <h2 className="text-heading-lg text-white mb-4">
                  White-label Widgets & Data Feeds
                </h2>
                <p className="text-body text-white/70 mb-8">
                  Integrate our broker analysis engine into your platform with customizable widgets, real-time data feeds, and comprehensive APIs.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Code className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Custom API Integration</div>
                      <div className="text-white/60 text-sm">RESTful APIs with real-time data access</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Embeddable Widgets</div>
                      <div className="text-white/60 text-sm">Customizable broker comparison and rating widgets</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Building className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">White-label Solutions</div>
                      <div className="text-white/60 text-sm">Fully branded broker analysis platform</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="cta-primary">
                    Contact Sales
                  </Button>
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </div>
              </div>
              
              {/* Visual Side */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="glass-card p-6 rounded-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-medium">API Response</div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="text-blue-400">GET /api/brokers/compare</div>
                        <div className="text-white/60">
                          {`{`}<br/>
                          &nbsp;&nbsp;"brokers": [<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;{`{`}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "TradePro",<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"trust_score": 91,<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"spreads": "0.1 pips"<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;{`}`}<br/>
                          &nbsp;&nbsp;]<br/>
                          {`}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner Links */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-6">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
              For Brokers / Partners
            </Button>
            <div className="w-px h-4 bg-white/20"></div>
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
              <ExternalLink className="w-4 h-4 mr-2" />
              Developer Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseCTA;