'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shuffle, Calculator } from 'lucide-react';

const brokerOptions = [
  { value: "tradepro-elite", label: "TradePro Elite", spread: 0.15 },
  { value: "globalfx", label: "GlobalFX Markets", spread: 1.2 },
  { value: "alphatrade", label: "AlphaTrade Pro", spread: 0.8 },
  { value: "oceanfx", label: "OceanFX Global", spread: 1.5 }
];

const currencyPairs = [
  { value: "EURUSD", label: "EUR/USD" },
  { value: "GBPUSD", label: "GBP/USD" },
  { value: "USDJPY", label: "USD/JPY" },
  { value: "AUDUSD", label: "AUD/USD" }
];

const lotSizes = [
  { value: 0.01, label: "0.01 (Micro)" },
  { value: 0.1, label: "0.1 (Mini)" },
  { value: 1, label: "1.0 (Standard)" },
  { value: 10, label: "10.0 (Large)" }
];

export const CompareTeaser: React.FC = () => {
  const [brokerA, setBrokerA] = useState<string>('');
  const [brokerB, setBrokerB] = useState<string>('');
  const [currencyPair, setCurrencyPair] = useState<string>('EURUSD');
  const [lotSize, setLotSize] = useState<number>(1);
  const [tradesPerDay, setTradesPerDay] = useState<number>(10);

  const calculateCost = (brokerValue: string) => {
    const broker = brokerOptions.find(b => b.value === brokerValue);
    if (!broker) return 0;
    
    const pipValue = lotSize * 10; // Simplified pip value calculation
    return broker.spread * pipValue * tradesPerDay;
  };

  const costA = brokerA ? calculateCost(brokerA) : 0;
  const costB = brokerB ? calculateCost(brokerB) : 0;
  const savings = Math.abs(costA - costB);

  return (
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-heading-lg text-gradient mb-4">Compare & Calculate</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Calculate your trading costs and compare brokers side-by-side to find the best deal.
          </p>
        </div>

        <Card className="modern-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Trading Cost Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="text-white/80">Broker A</Label>
                <Select value={brokerA} onValueChange={setBrokerA}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {brokerOptions.map((broker) => (
                      <SelectItem key={broker.value} value={broker.value} className="text-white">
                        {broker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Broker B</Label>
                <Select value={brokerB} onValueChange={setBrokerB}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {brokerOptions.map((broker) => (
                      <SelectItem key={broker.value} value={broker.value} className="text-white">
                        {broker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Currency Pair</Label>
                <Select value={currencyPair} onValueChange={setCurrencyPair}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {currencyPairs.map((pair) => (
                      <SelectItem key={pair.value} value={pair.value} className="text-white">
                        {pair.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Lot Size</Label>
                <Select value={lotSize.toString()} onValueChange={(value) => setLotSize(Number(value))}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {lotSizes.map((lot) => (
                      <SelectItem key={lot.value} value={lot.value.toString()} className="text-white">
                        {lot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {brokerA && brokerB && (
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      {brokerOptions.find(b => b.value === brokerA)?.label}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${costA.toFixed(2)}/day
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Shuffle className="w-6 h-6 text-white/40" />
                  </div>
                  
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      {brokerOptions.find(b => b.value === brokerB)?.label}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${costB.toFixed(2)}/day
                    </div>
                  </div>
                </div>
                
                {savings > 0 && (
                  <div className="text-center mt-4 pt-4 border-t border-white/10">
                    <div className="text-green-400 font-semibold">
                      Potential savings: ${savings.toFixed(2)}/day
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button className="cta-primary w-full">
              <Shuffle className="w-4 h-4 mr-2" />
              Compare Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};