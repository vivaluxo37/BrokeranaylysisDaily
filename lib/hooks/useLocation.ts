import { useState, useEffect, useCallback } from 'react';
import { getLocationFromIP, IPLocationData } from '@/lib/services/ipGeolocation';

export interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  accuracy?: number;
  timestamp: number;
  source?: 'gps' | 'ip';
}

export interface LocationError {
  code: number;
  message: string;
}

export interface UseLocationReturn {
  location: LocationData | null;
  error: LocationError | null;
  loading: boolean;
  requestLocation: () => void;
  clearLocation: () => void;
  hasPermission: boolean;
}

const LOCATION_STORAGE_KEY = 'broker_analysis_user_location';
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // Load cached location on mount
  useEffect(() => {
    const cachedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (cachedLocation) {
      try {
        const parsed: LocationData = JSON.parse(cachedLocation);
        const now = Date.now();
        
        // Check if cached location is still valid
        if (now - parsed.timestamp < LOCATION_CACHE_DURATION) {
          setLocation(parsed);
        } else {
          localStorage.removeItem(LOCATION_STORAGE_KEY);
        }
      } catch (err) {
        localStorage.removeItem(LOCATION_STORAGE_KEY);
      }
    }
  }, []);

  // Check geolocation permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setHasPermission(result.state === 'granted');
        
        result.addEventListener('change', () => {
          setHasPermission(result.state === 'granted');
        });
      });
    }
  }, []);

  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    try {
      // Using a free geocoding service (you might want to use a more reliable one)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.countryName,
          countryCode: data.countryCode,
          city: data.city || data.locality,
          region: data.principalSubdivision
        };
      }
    } catch (err) {
      console.warn('Reverse geocoding failed:', err);
    }
    
    return {};
  };

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Try GPS first if available
    if (navigator.geolocation) {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      };

      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude, accuracy } = position.coords;
                const timestamp = Date.now();
                
                // Get additional location info
                const geoData = await reverseGeocode(latitude, longitude);
                
                const locationData: LocationData = {
                  latitude,
                  longitude,
                  accuracy: accuracy || undefined,
                  timestamp,
                  source: 'gps',
                  ...geoData
                };

                setLocation(locationData);
                setHasPermission(true);
                
                // Cache the location
                localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
                resolve();
              } catch (err) {
                reject(new Error('Failed to process GPS location data'));
              }
            },
            (err) => {
              reject(err);
            },
            options
          );
        });
        setLoading(false);
        return;
      } catch (gpsError) {
        console.warn('GPS location failed, trying IP fallback:', gpsError);
        setHasPermission(false);
      }
    }

    // Fallback to IP geolocation
    try {
      const ipLocationData = await getLocationFromIP();
      if (ipLocationData) {
        const locationData: LocationData = {
          latitude: ipLocationData.latitude || 0,
          longitude: ipLocationData.longitude || 0,
          accuracy: 50000, // IP location is less accurate
          country: ipLocationData.country,
          city: ipLocationData.city,
          region: ipLocationData.region,
          timestamp: Date.now(),
          source: 'ip'
        };

        setLocation(locationData);
        
        // Cache the location
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
      } else {
        throw new Error('IP geolocation failed');
      }
    } catch (ipError) {
      console.error('All location detection methods failed:', ipError);
      setError({
        code: -3,
        message: 'Unable to detect location. Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  }, []);

  return {
    location,
    error,
    loading,
    requestLocation,
    clearLocation,
    hasPermission
  };
};

export default useLocation;