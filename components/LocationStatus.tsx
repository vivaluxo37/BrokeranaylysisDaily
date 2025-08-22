'use client';

import React from 'react';
import { MapPin, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/lib/contexts/LocationContext';
import { cn } from '@/lib/utils';

interface LocationStatusProps {
  className?: string;
  compact?: boolean;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({
  className,
  compact = false
}) => {
  const { location, loading, requestLocation, clearLocation } = useLocationContext();

  if (!location) {
    return null;
  }

  const formatLocation = () => {
    if (location.city && location.country) {
      return `${location.city}, ${location.country}`;
    }
    if (location.country) {
      return location.country;
    }
    return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
  };

  const getLocationAccuracy = () => {
    if (!location.accuracy) return '';
    if (location.accuracy < 100) return 'High accuracy';
    if (location.accuracy < 1000) return 'Medium accuracy';
    return 'Low accuracy';
  };

  if (compact) {
    return (
      <div className={cn(
        "flex items-center space-x-2 text-sm text-gray-600",
        className
      )}>
        <MapPin className="w-4 h-4" />
        <span>{formatLocation()}</span>
        <button
          onClick={requestLocation}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
          title="Refresh location"
        >
          <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-green-50 border border-green-200 rounded-lg p-3",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-900 text-sm">
              Location Detected
            </h4>
            <p className="text-green-700 text-sm mt-1">
              {formatLocation()}
            </p>
            {location.source && (
              <p className="text-green-600 text-xs mt-1">
                {location.source === 'gps' ? '📍 GPS detected' : '🌐 IP detected'}
              </p>
            )}
            {location.accuracy && (
              <p className="text-green-600 text-xs mt-1">
                {getLocationAccuracy()} • Updated {new Date(location.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            onClick={requestLocation}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="text-green-700 hover:text-green-900 hover:bg-green-100 p-1 h-auto"
            title="Refresh location"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          
          <Button
            onClick={clearLocation}
            size="sm"
            variant="ghost"
            className="text-green-700 hover:text-green-900 hover:bg-green-100 p-1 h-auto"
            title="Clear location"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationStatus;