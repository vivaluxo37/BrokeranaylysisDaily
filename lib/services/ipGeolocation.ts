/**
 * IP Geolocation Service
 * Provides fallback location detection using IP address when GPS is unavailable
 */

export interface IPLocationData {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

/**
 * Get location data from IP address using multiple fallback services
 */
export async function getLocationFromIP(): Promise<IPLocationData | null> {
  // Try multiple IP geolocation services for reliability
  const services = [
    () => getLocationFromIPAPI(),
    () => getLocationFromIPInfo(),
    () => getLocationFromIPGeolocation()
  ];

  for (const service of services) {
    try {
      const result = await service();
      if (result) {
        console.log('IP geolocation successful:', result);
        return result;
      }
    } catch (error) {
      console.warn('IP geolocation service failed:', error);
      continue;
    }
  }

  console.error('All IP geolocation services failed');
  return null;
}

/**
 * Primary service: ipapi.co (free tier: 1000 requests/day)
 */
async function getLocationFromIPAPI(): Promise<IPLocationData | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'API error');
    }

    return {
      country: data.country_name,
      countryCode: data.country_code,
      city: data.city,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    };
  } catch (error) {
    console.warn('ipapi.co failed:', error);
    return null;
  }
}

/**
 * Fallback service: ipinfo.io (free tier: 50,000 requests/month)
 */
async function getLocationFromIPInfo(): Promise<IPLocationData | null> {
  try {
    const response = await fetch('https://ipinfo.io/json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.bogon) {
      throw new Error('Private IP address');
    }

    const [lat, lng] = data.loc ? data.loc.split(',').map(Number) : [undefined, undefined];

    return {
      country: data.country, // Note: ipinfo.io returns country code, not name
      countryCode: data.country,
      city: data.city,
      region: data.region,
      latitude: lat,
      longitude: lng,
      timezone: data.timezone
    };
  } catch (error) {
    console.warn('ipinfo.io failed:', error);
    return null;
  }
}

/**
 * Secondary fallback: ip-api.com (free tier: 1000 requests/hour)
 */
async function getLocationFromIPGeolocation(): Promise<IPLocationData | null> {
  try {
    const response = await fetch('http://ip-api.com/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'fail') {
      throw new Error(data.message || 'API error');
    }

    return {
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      region: data.regionName,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone
    };
  } catch (error) {
    console.warn('ip-api.com failed:', error);
    return null;
  }
}

/**
 * Get country code from country name (for consistency)
 */
export function getCountryCode(countryName: string): string {
  const countryMap: Record<string, string> = {
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    'Japan': 'JP',
    'China': 'CN',
    'India': 'IN',
    'Brazil': 'BR',
    'Russia': 'RU',
    'South Africa': 'ZA',
    'Mexico': 'MX',
    'Italy': 'IT',
    'Spain': 'ES',
    'Netherlands': 'NL',
    'Switzerland': 'CH',
    'Sweden': 'SE',
    'Norway': 'NO',
    'Denmark': 'DK',
    'Finland': 'FI',
    'Belgium': 'BE',
    'Austria': 'AT',
    'Poland': 'PL',
    'Czech Republic': 'CZ',
    'Hungary': 'HU',
    'Portugal': 'PT',
    'Greece': 'GR',
    'Turkey': 'TR',
    'Israel': 'IL',
    'South Korea': 'KR',
    'Singapore': 'SG',
    'Hong Kong': 'HK',
    'Taiwan': 'TW',
    'Thailand': 'TH',
    'Malaysia': 'MY',
    'Indonesia': 'ID',
    'Philippines': 'PH',
    'Vietnam': 'VN',
    'New Zealand': 'NZ',
    'Argentina': 'AR',
    'Chile': 'CL',
    'Colombia': 'CO',
    'Peru': 'PE',
    'Venezuela': 'VE',
    'Ecuador': 'EC',
    'Uruguay': 'UY',
    'Paraguay': 'PY',
    'Bolivia': 'BO',
    'Egypt': 'EG',
    'Nigeria': 'NG',
    'Kenya': 'KE',
    'Morocco': 'MA',
    'Ghana': 'GH',
    'Ethiopia': 'ET',
    'Uganda': 'UG',
    'Tanzania': 'TZ',
    'Zimbabwe': 'ZW',
    'Zambia': 'ZM',
    'Botswana': 'BW',
    'Namibia': 'NA',
    'Mozambique': 'MZ',
    'Madagascar': 'MG',
    'Mauritius': 'MU',
    'Seychelles': 'SC',
    'United Arab Emirates': 'AE',
    'Saudi Arabia': 'SA',
    'Qatar': 'QA',
    'Kuwait': 'KW',
    'Bahrain': 'BH',
    'Oman': 'OM',
    'Jordan': 'JO',
    'Lebanon': 'LB',
    'Cyprus': 'CY',
    'Malta': 'MT',
    'Luxembourg': 'LU',
    'Iceland': 'IS',
    'Ireland': 'IE',
    'Estonia': 'EE',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Slovenia': 'SI',
    'Slovakia': 'SK',
    'Croatia': 'HR',
    'Serbia': 'RS',
    'Montenegro': 'ME',
    'Bosnia and Herzegovina': 'BA',
    'North Macedonia': 'MK',
    'Albania': 'AL',
    'Bulgaria': 'BG',
    'Romania': 'RO',
    'Moldova': 'MD',
    'Ukraine': 'UA',
    'Belarus': 'BY',
    'Georgia': 'GE',
    'Armenia': 'AM',
    'Azerbaijan': 'AZ',
    'Kazakhstan': 'KZ',
    'Uzbekistan': 'UZ',
    'Kyrgyzstan': 'KG',
    'Tajikistan': 'TJ',
    'Turkmenistan': 'TM',
    'Afghanistan': 'AF',
    'Pakistan': 'PK',
    'Bangladesh': 'BD',
    'Sri Lanka': 'LK',
    'Nepal': 'NP',
    'Bhutan': 'BT',
    'Maldives': 'MV',
    'Myanmar': 'MM',
    'Cambodia': 'KH',
    'Laos': 'LA',
    'Mongolia': 'MN',
    'North Korea': 'KP'
  };

  return countryMap[countryName] || countryName;
}