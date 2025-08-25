'use client';

import React from 'react';
import TradingViewWidget from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EconomicCalendarWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  height?: number;
  theme?: 'light' | 'dark';
  importanceFilter?: string;
  countryFilter?: string;
}

const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({
  className,
  title = 'Economic Calendar',
  showHeader = true,
  height = 500,
  theme = 'dark',
  importanceFilter = '-1,0,1', // All importance levels
  countryFilter = 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu'
}) => {
  if (!showHeader) {
    return (
      <div className={cn('w-full', className)}>
        <TradingViewWidget
          widgetType="economic-calendar"
          height={height}
          theme={theme}
          colorTheme={theme}
          autosize={true}
          importanceFilter={importanceFilter}
          countryFilter={countryFilter}
          isTransparent={true}
        />
      </div>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="w-5 h-5 text-green-500" />
          {title}
        </CardTitle>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Track upcoming economic events and announcements that may impact currency pairs and market movements. 
            High-impact events are highlighted for better trading decisions.
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full" style={{ height: `${height}px` }}>
          <TradingViewWidget
            widgetType="economic-calendar"
            height={height}
            theme={theme}
            colorTheme={theme}
            autosize={true}
            importanceFilter={importanceFilter}
            countryFilter={countryFilter}
            isTransparent={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EconomicCalendarWidget;
