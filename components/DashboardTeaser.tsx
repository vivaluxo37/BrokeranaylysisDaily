import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { mockQuery } from '@/app/homepageMockData';

interface AlertTileProps {
  id: string;
  type: string;
  title: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

const AlertTile: React.FC<AlertTileProps> = ({ title, timestamp, severity }) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`alert-tile alert-tile-${severity}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getSeverityIcon(severity)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm leading-relaxed">{title}</p>
          <div className="flex items-center justify-between mt-2">
            <Badge className={`alert-${severity} text-xs`}>
              {severity.toUpperCase()}
            </Badge>
            <span className="text-white/60 text-xs">
              {formatTimestamp(timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardTeaser: React.FC = () => {
  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Dashboard Preview</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Monitor broker performance, regulatory changes, and market alerts in real-time.
          </p>
        </div>

        <Card className="modern-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LayoutGrid className="w-5 h-5 mr-2" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {mockQuery.dashboardAlerts.map((alert) => (
                <AlertTile key={alert.id} {...alert} />
              ))}
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-white/80 text-sm text-center">
                Watch brokers and get email/push alerts for regulatory changes, spread spikes, and platform issues.
              </p>
            </div>

            <Button className="cta-primary w-full">
              <LayoutGrid className="w-4 h-4 mr-2" />
              Open Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};