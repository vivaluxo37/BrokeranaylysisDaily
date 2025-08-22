'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Broker } from '@/lib/types'

interface BrokerFAQProps {
  broker: Broker
}

interface FAQItem {
  question: string
  answer: string
}

export default function BrokerFAQ({ broker }: BrokerFAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Generate broker-specific FAQs
  const faqs: FAQItem[] = [
    {
      question: `Is ${broker.name} regulated and safe?`,
      answer: `${broker.name} is regulated by multiple financial authorities and maintains strict compliance with international standards. The broker implements segregated client funds, investor compensation schemes, and follows robust security protocols to protect client assets and data.`
    },
    {
      question: `What is the minimum deposit required for ${broker.name}?`,
      answer: `The minimum deposit for ${broker.name} is $${broker.minimum_deposit}. This makes it accessible for both beginner and experienced traders. Different account types may have varying minimum deposit requirements.`
    },
    {
      question: `What trading platforms does ${broker.name} offer?`,
      answer: `${broker.name} provides multiple trading platforms including MetaTrader 4, MetaTrader 5, and their proprietary web-based platform. All platforms offer advanced charting tools, technical indicators, and automated trading capabilities.`
    },
    {
      question: `What is the maximum leverage offered by ${broker.name}?`,
      answer: `${broker.name} offers leverage up to ${broker.maximum_leverage}. Please note that leverage regulations vary by region and account type. Higher leverage increases both potential profits and risks.`
    },
    {
      question: `How does ${broker.name}'s trust score compare to other brokers?`,
      answer: `${broker.name} has a trust score of ${broker.trust_score}/100, which is calculated based on regulation, security, transparency, reputation, and customer service. This score helps traders assess the broker's reliability and trustworthiness.`
    },
    {
      question: `What trading instruments are available with ${broker.name}?`,
      answer: `${broker.name} offers a comprehensive range of trading instruments including forex pairs, CFDs on stocks, indices, commodities, and cryptocurrencies. The exact selection may vary based on your location and account type.`
    },
    {
      question: `How can I contact ${broker.name} customer support?`,
      answer: `${broker.name} provides 24/5 customer support through multiple channels including live chat, email, and phone. Their multilingual support team is available during market hours to assist with trading and account-related queries.`
    },
    {
      question: `What are the withdrawal and deposit options for ${broker.name}?`,
      answer: `${broker.name} supports various payment methods including bank transfers, credit/debit cards, and popular e-wallets. Withdrawal processing times typically range from 1-5 business days depending on the chosen method.`
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Frequently Asked Questions about {broker.name}
        </h2>
        <p className="text-gray-600">
          Get answers to common questions about {broker.name}'s services, features, and trading conditions.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openItems.includes(index)
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Still have questions?</h3>
        <p className="text-blue-800 text-sm mb-3">
          Can't find the answer you're looking for? Our expert team is here to help you make informed trading decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={broker.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Contact {broker.name}
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Ask Our Experts
          </a>
        </div>
      </div>
    </div>
  )
}