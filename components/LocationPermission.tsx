'use client';

import React, { useState } from 'react';
import { MapPin, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationContext } from '@/lib/contexts/LocationContext';
import { cn } from '@/lib/utils';

interface LocationPermissionProps {
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onClose,
  showCloseButton = true,
  className
}) => {
  const { location, error, loading, requestLocation, hasPermission } = useLocationContext();
  const [dismissed, setDismissed] = useState(false);

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  const handleRequestLocation = () => {
    requestLocation();
  };

  // Don't show if dismissed or if we already have location
  if (dismissed || location) {
    return null;
  }

  return (
    <div className={cn(
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              Get Personalized Broker Recommendations
            </h3>
            <p className="text-xs text-white/90 mb-3">
              Allow location access to see brokers available in your region and get personalized recommendations based on local regulations.
            </p>
            
            {error && (
              <div className="flex items-center space-x-2 mb-3 p-2 bg-red-500/20 rounded border border-red-400/30">
                <AlertCircle className="w-4 h-4 text-red-300" />
                <span className="text-xs text-red-200">
                  {error.code === 1 ? 'Location access denied. You can enable it in your browser settings.' :
                   error.code === 2 ? 'Unable to determine your location. Please try again.' :
                   error.code === 3 ? 'Location request timed out. Please try again.' :
                   'Location detection failed. You can still browse all brokers.'}
                </span>
              </div>
            )}

            {hasPermission && !location && !error && (
              <div className="flex items-center space-x-2 mb-3 p-2 bg-green-500/20 rounded border border-green-400/30">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-200">
                  Location permission granted. Click "Detect Location" to get your position.
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleRequestLocation}
                disabled={loading}
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 mr-1" />
                    Detect Location
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleClose}
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 text-xs"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
        
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationPermission;