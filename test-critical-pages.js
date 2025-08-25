// Test script to check which critical pages are missing
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

const criticalPages = [
  '/brokers',
  '/compare',
  '/privacy',
  '/terms',
  '/about',
  '/contact',
  '/brokers/reviews',
  '/brokers/countries',
  '/brokers/platforms',
  '/brokers/account-types',
  '/brokers/country/us',
  '/brokers/country/uk',
  '/brokers/platform/mt4',
  '/brokers/platform/mt5',
  '/compare/ic-markets-vs-pepperstone',
  '/tools/pip-calculator',
  '/tools/risk-calculator',
  '/tools/broker-comparison'
];

async function testPage(url) {
  try {
    const response = await fetch(url);
    return {
      url,
      status: response.status,
      statusText: response.statusText,
      exists: response.status === 200
    };
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      statusText: error.message,
      exists: false
    };
  }
}

async function testCriticalPages() {
  console.log('🔍 Testing Critical Pages...\n');

  const results = [];
  
  for (const page of criticalPages) {
    const url = `${BASE_URL}${page}`;
    const result = await testPage(url);
    results.push(result);
    
    const status = result.exists ? '✅' : '❌';
    console.log(`${status} ${page} - ${result.status} ${result.statusText}`);
  }

  console.log('\n📊 Summary:');
  const working = results.filter(r => r.exists);
  const missing = results.filter(r => !r.exists);
  
  console.log(`✅ Working: ${working.length}/${results.length}`);
  console.log(`❌ Missing: ${missing.length}/${results.length}`);
  
  if (missing.length > 0) {
    console.log('\n🚨 Missing Critical Pages:');
    missing.forEach(page => {
      console.log(`   - ${page.url} (${page.status})`);
    });
  }

  console.log('\n🎯 Pages to Implement:');
  const highPriority = missing.filter(p => 
    p.url.includes('/brokers/') || 
    p.url.includes('/compare/') ||
    p.url.includes('/about')
  );
  
  if (highPriority.length > 0) {
    highPriority.forEach(page => {
      console.log(`   - ${page.url.replace(BASE_URL, '')} - High Priority`);
    });
  } else {
    console.log('   All high priority pages are implemented! ✅');
  }

  return { working, missing, total: results.length };
}

testCriticalPages().catch(console.error);
