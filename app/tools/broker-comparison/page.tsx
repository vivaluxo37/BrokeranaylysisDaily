import { Metadata } from 'next';
import BrokerComparisonClient from './BrokerComparisonClient';

export const metadata: Metadata = {
  title: 'Broker Comparison Tool - Compare Forex & CFD Brokers',
  description: 'Use our advanced broker comparison tool to compare spreads, commissions, platforms, and features of top forex and CFD brokers side by side.',
  openGraph: {
    title: 'Broker Comparison Tool - Compare Forex & CFD Brokers',
    description: 'Compare spreads, commissions, platforms, and features of top forex and CFD brokers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Broker Comparison Tool - Compare Forex & CFD Brokers',
    description: 'Compare spreads, commissions, platforms, and features of top forex and CFD brokers.',
  },
  alternates: {
    canonical: 'https://brokeranalysisdaily.com/tools/broker-comparison',
  },
};

export default function BrokerComparisonPage() {
  return <BrokerComparisonClient />;
}