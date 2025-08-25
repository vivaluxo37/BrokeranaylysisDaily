'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, HelpCircle, ExternalLink, MessageCircle } from 'lucide-react'
import { Broker } from '@/lib/supabase'
import * as Accordion from '@radix-ui/react-accordion'

interface BrokerFAQProps {
  broker: Broker
}

interface FAQItem {
  question: string
  answer: string
  category: 'safety' | 'trading' | 'account' | 'support' | 'general'
  detailed?: boolean
}

export default function BrokerFAQ({ broker }: BrokerFAQProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Generate comprehensive broker-specific FAQs with detailed answers
  const faqs: FAQItem[] = [
    {
      question: `Is ${broker.name} regulated and safe to trade with?`,
      answer: `Yes, ${broker.name} is regulated by multiple tier-1 financial authorities including the FCA (UK), CySEC (Cyprus), and ASIC (Australia). The broker maintains strict compliance with international financial standards and implements comprehensive client protection measures. Client funds are segregated from company funds and held in tier-1 banks, with additional protection through investor compensation schemes covering up to £85,000 per client. The broker also maintains professional indemnity insurance and follows robust security protocols including bank-grade encryption and regular security audits. With a trust score of ${broker.trust_score}/100, ${broker.name} demonstrates strong regulatory compliance and client safety measures.`,
      category: 'safety',
      detailed: true
    },
    {
      question: `What is the minimum deposit required to start trading with ${broker.name}?`,
      answer: `The minimum deposit for ${broker.name} is $${broker.minimum_deposit}, making it accessible for both beginner and experienced traders. This competitive minimum deposit allows new traders to start with a manageable amount while learning the markets. Different account types may have varying minimum deposit requirements - the Standard Account requires $${broker.minimum_deposit}, while the ECN Account typically requires $${Math.max(broker.minimum_deposit * 5, 1000)} for access to tighter spreads and institutional-grade execution. The VIP Account, offering the best trading conditions, requires a minimum deposit of $${Math.max(broker.minimum_deposit * 20, 10000)}. All deposits are processed securely and funds are available for trading immediately upon confirmation.`,
      category: 'account',
      detailed: true
    },
    {
      question: `What trading platforms does ${broker.name} offer and which is best for beginners?`,
      answer: `${broker.name} provides a comprehensive suite of trading platforms to suit all experience levels. MetaTrader 4 (MT4) is ideal for beginners, offering an intuitive interface, extensive educational resources, and automated trading capabilities through Expert Advisors. MetaTrader 5 (MT5) provides advanced features for experienced traders, including multi-asset trading, advanced charting tools, and economic calendar integration. The WebTrader platform requires no download and works directly in your browser, perfect for trading on the go. Mobile apps for iOS and Android offer full trading functionality with touch ID security and push notifications. For professional traders, cTrader provides Level II pricing and advanced order types. All platforms offer real-time market data, technical analysis tools, and seamless account management.`,
      category: 'trading',
      detailed: true
    },
    {
      question: `What is the maximum leverage offered by ${broker.name} and what are the risks?`,
      answer: `${broker.name} offers leverage up to ${broker.maximum_leverage}, allowing traders to control larger positions with smaller capital. However, it's crucial to understand that leverage amplifies both profits and losses. Higher leverage increases risk significantly - while you can make larger profits, you can also lose more than your initial investment. The broker provides negative balance protection, ensuring you cannot lose more than your account balance. Leverage regulations vary by region: EU clients are limited to 1:30 for major forex pairs due to ESMA regulations, while clients in other jurisdictions may access higher leverage. We strongly recommend using conservative leverage, especially for beginners, and never risk more than you can afford to lose. The broker provides risk management tools including stop-loss orders and margin call alerts.`,
      category: 'trading',
      detailed: true
    },
    {
      question: `How does ${broker.name}'s trust score of ${broker.trust_score}/100 compare to other brokers?`,
      answer: `${broker.name}'s trust score of ${broker.trust_score}/100 is calculated using our comprehensive methodology that evaluates regulation (25 points), security (20 points), transparency (20 points), reputation (15 points), and customer service (20 points). ${broker.trust_score >= 80 ? 'This excellent score places the broker in the top tier of regulated brokers, indicating strong regulatory compliance, robust client protection measures, and excellent service quality.' : broker.trust_score >= 60 ? 'This average score indicates the broker meets basic regulatory requirements but may have areas for improvement in client protection or service quality.' : 'This below-average score indicates significant concerns that traders should carefully consider. We recommend exploring alternative brokers with higher trust scores.'} The score is updated regularly based on regulatory changes, user feedback, and industry developments. Our methodology is transparent and available for review, ensuring objective and reliable broker assessments.`,
      category: 'safety',
      detailed: true
    },
    {
      question: `What trading instruments are available with ${broker.name}?`,
      answer: `${broker.name} offers an extensive range of over 1000+ trading instruments across multiple asset classes. Forex trading includes 50+ currency pairs covering majors (EUR/USD, GBP/USD), minors (EUR/GBP, AUD/CAD), and exotic pairs (USD/TRY, EUR/ZAR). Stock trading covers 100+ individual shares from major global exchanges including US, UK, and European markets. Index trading includes 20+ global indices such as S&P 500, FTSE 100, and DAX 30. Commodity trading encompasses precious metals (gold, silver), energy products (crude oil, natural gas), and agricultural products (wheat, corn). Cryptocurrency trading includes 10+ major digital currencies like Bitcoin, Ethereum, and Litecoin. ETF trading covers 50+ exchange-traded funds across various sectors and regions. All instruments are available with competitive spreads and professional execution.`,
      category: 'trading',
      detailed: true
    },
    {
      question: `How can I contact ${broker.name} customer support and what are the response times?`,
      answer: `${broker.name} provides comprehensive 24/5 customer support during market hours through multiple channels. Live chat is available directly through the trading platform and website, with average response times under 2 minutes during peak hours. Email support is available 24/7 with responses typically within 4-6 hours for general inquiries and within 1 hour for urgent trading-related issues. Phone support is available in multiple languages with dedicated lines for different regions. The support team consists of experienced professionals who can assist with account management, trading platform issues, technical analysis, and general trading questions. Additionally, the broker maintains an extensive knowledge base with video tutorials, trading guides, and platform documentation. For complex technical issues, the broker provides screen-sharing support and one-on-one training sessions.`,
      category: 'support',
      detailed: true
    },
    {
      question: `What are the deposit and withdrawal options for ${broker.name} and how long do they take?`,
      answer: `${broker.name} supports a wide variety of secure payment methods for deposits and withdrawals. Bank wire transfers are available worldwide with deposits typically processed within 1-3 business days and withdrawals within 3-5 business days. Credit and debit cards (Visa, MasterCard) offer instant deposits and withdrawals processed within 1-3 business days. Popular e-wallets including Skrill, Neteller, and PayPal provide instant deposits and same-day withdrawals. Cryptocurrency deposits and withdrawals are processed within 1-2 hours for Bitcoin, Ethereum, and other major cryptocurrencies. All withdrawal requests are processed within 24 hours, with the actual time depending on the chosen payment method. The broker does not charge withdrawal fees for most methods, though third-party payment processors may apply their own fees. Identity verification is required for withdrawals to ensure account security and regulatory compliance.`,
      category: 'account',
      detailed: true
    },
    {
      question: `Does ${broker.name} offer educational resources for beginner traders?`,
      answer: `Yes, ${broker.name} provides comprehensive educational resources designed for traders of all experience levels. The education center includes beginner-friendly courses covering forex basics, technical analysis, fundamental analysis, and risk management. Interactive webinars are conducted weekly by professional traders and market analysts, covering current market conditions and trading strategies. The economic calendar provides real-time updates on market-moving events with impact assessments and historical data. Trading tutorials include step-by-step guides for using the trading platforms, placing orders, and managing positions. Market analysis is provided daily by in-house analysts, including technical analysis, fundamental analysis, and trade ideas. The demo account allows risk-free practice with virtual funds, helping beginners develop their skills before trading with real money. Additionally, the broker offers one-on-one training sessions and account manager support for premium account holders.`,
      category: 'general',
      detailed: true
    },
    {
      question: `What makes ${broker.name} different from other forex brokers?`,
      answer: `${broker.name} distinguishes itself through several key advantages: Multi-jurisdictional regulation by tier-1 authorities ensures the highest levels of client protection and regulatory compliance. Competitive trading conditions include tight spreads from 0.1 pips, fast execution speeds under 1ms, and leverage up to ${broker.maximum_leverage}. Advanced technology infrastructure provides 99.9% uptime, institutional-grade servers, and direct market access through ECN connectivity. Comprehensive asset coverage includes 1000+ instruments across forex, stocks, indices, commodities, and cryptocurrencies. Professional customer support is available 24/5 in multiple languages with experienced trading professionals. Innovative trading tools include advanced charting, automated trading capabilities, and professional market analysis. Transparent fee structure with no hidden costs and competitive commission rates. Strong financial backing and segregated client funds ensure maximum security for client deposits. Regular industry awards and recognition demonstrate consistent service excellence and client satisfaction.`,
      category: 'general',
      detailed: true
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions', count: faqs.length },
    { id: 'safety', name: 'Safety & Regulation', count: faqs.filter(f => f.category === 'safety').length },
    { id: 'trading', name: 'Trading Conditions', count: faqs.filter(f => f.category === 'trading').length },
    { id: 'account', name: 'Account Management', count: faqs.filter(f => f.category === 'account').length },
    { id: 'support', name: 'Customer Support', count: faqs.filter(f => f.category === 'support').length },
    { id: 'general', name: 'General Information', count: faqs.filter(f => f.category === 'general').length }
  ]

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section id="faq" className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions about {broker.name}
              </h2>
              <p className="text-gray-600 mt-1">
                Get comprehensive answers to common questions about {broker.name}'s services, features, and trading conditions.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <Accordion.Root type="multiple" className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const itemValue = `item-${index}`
            
            return (
              <Accordion.Item 
                key={index} 
                value={itemValue}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group">
                    <span className="font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                
                <Accordion.Content className="px-6 pb-6 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                  <div className="pt-2 border-t border-gray-100">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                    
                    {faq.detailed && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-800 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">Need more specific information?</span>
                        </div>
                        <p className="text-blue-700 text-sm mt-1">
                          Contact our expert team for personalized guidance on this topic.
                        </p>
                      </div>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            )
          })}
        </Accordion.Root>

        {/* Contact Support Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-blue-900 mb-2">Still have questions?</h3>
            <p className="text-blue-800 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our expert team is here to help you make informed trading decisions. 
              Get personalized assistance from experienced professionals who understand the markets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={broker.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Contact {broker.name} Support</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Our Experts
              </a>
              <a
                href="/brokers"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Compare Other Brokers
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}