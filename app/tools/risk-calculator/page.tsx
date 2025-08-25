import { Metadata } from 'next';
import RiskCalculatorClient from './RiskCalculatorClient';

export const metadata: Metadata = {
  title: 'Risk Calculator - Calculate Position Sizes & Risk Management',
  description: 'Use our free risk calculator to determine optimal position sizes, stop-loss levels, and risk-reward ratios for your trades. Perfect for forex and stock traders.',
  openGraph: {
    title: 'Risk Calculator - Calculate Position Sizes & Risk Management',
    description: 'Determine optimal position sizes, stop-loss levels, and risk-reward ratios for your trades.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Risk Calculator - Calculate Position Sizes & Risk Management',
    description: 'Determine optimal position sizes, stop-loss levels, and risk-reward ratios for your trades.',
  },
  alternates: {
    canonical: 'https://brokeranalysisdaily.com/tools/risk-calculator',
  },
};

export default function RiskCalculatorPage() {
  return <RiskCalculatorClient />;
}