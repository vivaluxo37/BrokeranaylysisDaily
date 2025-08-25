import { Metadata } from 'next';
import PipCalculatorClient from './PipCalculatorClient';

export const metadata: Metadata = {
  title: 'Pip Calculator - Calculate Pip Values & Profit/Loss',
  description: 'Use our free pip calculator to determine pip values, profit/loss, and margin requirements for forex and CFD trades. Essential for risk management.',
  openGraph: {
    title: 'Pip Calculator - Calculate Pip Values & Profit/Loss',
    description: 'Determine pip values, profit/loss, and margin requirements for forex and CFD trades.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pip Calculator - Calculate Pip Values & Profit/Loss',
    description: 'Determine pip values, profit/loss, and margin requirements for forex and CFD trades.',
  },
  alternates: {
    canonical: 'https://brokeranalysisdaily.com/tools/pip-calculator',
  },
};

export default function PipCalculatorPage() {
  return <PipCalculatorClient />;
}