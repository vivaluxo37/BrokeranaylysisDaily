'use client'

import React, { useState } from 'react'
import { Bot, Send, Loader, CheckCircle, AlertCircle } from 'lucide-react'

interface UserPreferences {
  experience: string
  tradingStyle: string
  instruments: string[]
  budget: string
  country: string
  platform: string
  features: string[]
}

interface BrokerRecommendation {
  name: string
  rating: number
  trustScore: number
  reason: string
  pros: string[]
  cons: string[]
  minDeposit: string
  regulation: string
}

const AIAssistantComponent: React.FC = () => {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState<UserPreferences>({
    experience: '',
    tradingStyle: '',
    instruments: [],
    budget: '',
    country: '',
    platform: '',
    features: []
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<BrokerRecommendation[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: 'experience',
      title: 'What is your trading experience level?',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner (0-1 years)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'advanced', label: 'Advanced (3+ years)' },
        { value: 'professional', label: 'Professional trader' }
      ]
    },
    {
      id: 'tradingStyle',
      title: 'What is your preferred trading style?',
      type: 'single',
      options: [
        { value: 'scalping', label: 'Scalping (seconds to minutes)' },
        { value: 'day-trading', label: 'Day Trading (intraday)' },
        { value: 'swing-trading', label: 'Swing Trading (days to weeks)' },
        { value: 'position-trading', label: 'Position Trading (weeks to months)' }
      ]
    },
    {
      id: 'instruments',
      title: 'Which instruments do you want to trade?',
      type: 'multiple',
      options: [
        { value: 'forex', label: 'Forex (Currency Pairs)' },
        { value: 'stocks', label: 'Stocks' },
        { value: 'indices', label: 'Stock Indices' },
        { value: 'commodities', label: 'Commodities' },
        { value: 'crypto', label: 'Cryptocurrencies' },
        { value: 'bonds', label: 'Bonds' }
      ]
    },
    {
      id: 'budget',
      title: 'What is your initial trading budget?',
      type: 'single',
      options: [
        { value: 'under-500', label: 'Under $500' },
        { value: '500-2000', label: '$500 - $2,000' },
        { value: '2000-10000', label: '$2,000 - $10,000' },
        { value: '10000-50000', label: '$10,000 - $50,000' },
        { value: 'over-50000', label: 'Over $50,000' }
      ]
    },
    {
      id: 'country',
      title: 'Which country are you located in?',
      type: 'single',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'au', label: 'Australia' },
        { value: 'ca', label: 'Canada' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'platform',
      title: 'Which trading platform do you prefer?',
      type: 'single',
      options: [
        { value: 'mt4', label: 'MetaTrader 4' },
        { value: 'mt5', label: 'MetaTrader 5' },
        { value: 'ctrader', label: 'cTrader' },
        { value: 'tradingview', label: 'TradingView' },
        { value: 'proprietary', label: 'Broker\'s own platform' },
        { value: 'no-preference', label: 'No preference' }
      ]
    },
    {
      id: 'features',
      title: 'Which features are most important to you?',
      type: 'multiple',
      options: [
        { value: 'low-spreads', label: 'Low spreads' },
        { value: 'no-commission', label: 'No commission' },
        { value: 'copy-trading', label: 'Copy trading' },
        { value: 'education', label: 'Educational resources' },
        { value: 'research', label: 'Market research' },
        { value: 'mobile-app', label: 'Mobile app' },
        { value: 'customer-support', label: '24/7 customer support' },
        { value: 'demo-account', label: 'Demo account' }
      ]
    }
  ]

  const handleAnswer = (questionId: string, value: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    if (question.type === 'single') {
      setPreferences(prev => ({ ...prev, [questionId]: value }))
    } else {
      setPreferences(prev => {
        const currentValues = prev[questionId as keyof UserPreferences] as string[]
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
        return { ...prev, [questionId]: newValues }
      })
    }
  }

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      analyzePreferences()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const analyzePreferences = async () => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate mock recommendations based on preferences
    const mockRecommendations: BrokerRecommendation[] = [
      {
        name: 'IC Markets',
        rating: 4.8,
        trustScore: 95,
        reason: 'Perfect for your scalping strategy with ultra-tight spreads and fast execution',
        pros: ['0.0 pip spreads', 'Fast execution', 'ASIC regulated', 'cTrader platform'],
        cons: ['Commission-based', 'Higher minimum deposit'],
        minDeposit: '$200',
        regulation: 'ASIC, CySEC'
      },
      {
        name: 'Pepperstone',
        rating: 4.7,
        trustScore: 92,
        reason: 'Excellent for intermediate traders with competitive conditions and good support',
        pros: ['Low spreads', 'Multiple platforms', 'Good education', 'Fast withdrawals'],
        cons: ['Limited research', 'No US clients'],
        minDeposit: '$200',
        regulation: 'ASIC, FCA'
      },
      {
        name: 'XM Group',
        rating: 4.5,
        trustScore: 88,
        reason: 'Great for beginners with extensive education and low minimum deposit',
        pros: ['Low minimum deposit', 'Great education', 'Multiple bonuses', 'Good support'],
        cons: ['Higher spreads', 'Complex bonus terms'],
        minDeposit: '$5',
        regulation: 'CySEC, ASIC'
      }
    ]
    
    setRecommendations(mockRecommendations)
    setIsAnalyzing(false)
    setShowResults(true)
  }

  const resetAssistant = () => {
    setStep(0)
    setPreferences({
      experience: '',
      tradingStyle: '',
      instruments: [],
      budget: '',
      country: '',
      platform: '',
      features: []
    })
    setShowResults(false)
    setRecommendations([])
  }

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-8">
          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Your Personalized Recommendations</h2>
        </div>

        <div className="space-y-6">
          {recommendations.map((broker, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{broker.name}</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="font-bold text-blue-600">★ {broker.rating}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Trust Score</div>
                    <div className="font-bold text-green-600">{broker.trustScore}/100</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{broker.reason}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                  <ul className="text-sm space-y-1">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
                  <ul className="text-sm space-y-1">
                    {broker.cons.map((con, i) => (
                      <li key={i} className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Min Deposit:</span> {broker.minDeposit} | 
                  <span className="font-medium"> Regulation:</span> {broker.regulation}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={resetAssistant}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Get New Recommendations
          </button>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Loader className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Your Preferences</h2>
        <p className="text-gray-600 mb-6">
          Our AI is analyzing your trading profile and comparing it with 100+ brokers...
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[step]
  const currentValue = preferences[currentQuestion.id as keyof UserPreferences]
  const canProceed = currentQuestion.type === 'single' 
    ? currentValue !== '' 
    : Array.isArray(currentValue) && currentValue.length > 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-8">
        <Bot className="w-8 h-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">AI Broker Recommendation</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.title}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                currentQuestion.type === 'single'
                  ? currentValue === option.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                  : Array.isArray(currentValue) && currentValue.includes(option.value)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <input
                type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                name={currentQuestion.id}
                value={option.value}
                checked={
                  currentQuestion.type === 'single'
                    ? currentValue === option.value
                    : Array.isArray(currentValue) && currentValue.includes(option.value)
                }
                onChange={() => handleAnswer(currentQuestion.id, option.value)}
                className="mr-3"
              />
              <span className="text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {step === questions.length - 1 ? (
            <>
              Get Recommendations
              <Send className="w-4 h-4 ml-2" />
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  )
}

export default AIAssistantComponent
