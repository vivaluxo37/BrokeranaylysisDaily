// Test script to verify data cleaning functions
import { cleanBrokerData, extractPros, extractCons, formatSpreads, formatRegulation } from './brokerDataCleaner';

// Sample raw broker data from database
const sampleRawBroker = {
  id: 1,
  name: 'Test Broker',
  trust_score: 85,
  overall_rating: 4.5,
  minimum_deposit: 100,
  pros: ['Low spreads and fast execution. Great customer support available 24/7. Regulated by top-tier authorities including FCA and CySEC.'],
  cons: ['Limited educational resources. High withdrawal fees for small amounts. Platform can be complex for beginners.'],
  spreads_info: {
    EURUSD: 0.8,
    GBPUSD: 1.2,
    USDJPY: 0.9
  },
  regulation_info: {
    primary: 'FCA',
    secondary: 'CySEC',
    regulators: ['ASIC', 'FSA']
  }
};

// Test the cleaning functions
console.log('=== Testing Data Cleaning Functions ===');
console.log('\nOriginal broker data:');
console.log(JSON.stringify(sampleRawBroker, null, 2));

console.log('\n=== Testing extractPros ===');
const cleanedPros = extractPros(sampleRawBroker);
console.log('Cleaned pros:', cleanedPros);

console.log('\n=== Testing extractCons ===');
const cleanedCons = extractCons(sampleRawBroker);
console.log('Cleaned cons:', cleanedCons);

console.log('\n=== Testing formatSpreads ===');
const formattedSpreads = formatSpreads(sampleRawBroker.spreads_info);
console.log('Formatted spreads:', formattedSpreads);

console.log('\n=== Testing formatRegulation ===');
const formattedRegulation = formatRegulation(sampleRawBroker.regulation_info);
console.log('Formatted regulation:', formattedRegulation);

console.log('\n=== Testing cleanBrokerData ===');
const cleanedBroker = cleanBrokerData(sampleRawBroker);
console.log('Fully cleaned broker data:');
console.log(JSON.stringify(cleanedBroker, null, 2));

export { sampleRawBroker, cleanedBroker };