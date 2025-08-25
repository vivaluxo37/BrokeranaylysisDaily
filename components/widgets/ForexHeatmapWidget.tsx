'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForexHeatmapWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  height?: number;
  theme?: 'light' | 'dark';
  currencies?: string[];
}

const ForexHeatmapWidget: React.FC<ForexHeatmapWidgetProps> = ({
  className,
  title = 'Forex Market Heatmap',
  showHeader = true,
  height = 400,
  theme = 'dark',
  currencies = ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY']
}) => {
  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="forex-heatmap"
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          currencies={currencies}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Activity className="w-5 h-5 text-purple-500" />
          {title}
        </CardTitle>
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Visual representation of currency strength and weakness. Green indicates strength, red indicates weakness. 
            Perfect for identifying trading opportunities and market sentiment.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="forex-heatmap"
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            currencies={currencies}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ForexHeatmapWidget;
