import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { Scale, TrendingUp, Shield, DollarSign, Clock, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Broker Comparison Tool | Compare Forex & Trading Brokers Side-by-Side',
  description: 'Compare forex and trading brokers side-by-side. Analyze spreads, fees, platforms, regulation, and more to find the best broker for your trading needs.',
  keywords: 'broker comparison, compare brokers, forex broker comparison, trading broker comparison, broker vs broker',
  openGraph: {
    title: 'Broker Comparison Tool | Brokeranalysis',
    description: 'Compare brokers side-by-side with our comprehensive comparison tool. Make informed trading decisions.',
    type: 'website',
  }
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Scale className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Broker Comparison Tool
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Compare brokers side-by-side to find the perfect match for your trading strategy
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <p className="text-lg">
                ✨ Compare spreads, fees, platforms, regulation, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You Can Compare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive comparison tool analyzes every aspect of broker performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trading Costs</h3>
              <p className="text-gray-600">
                Spreads, commissions, overnight fees, and hidden costs
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trading Platforms</h3>
              <p className="text-gray-600">
                MT4, MT5, proprietary platforms, and mobile apps
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Regulation & Safety</h3>
              <p className="text-gray-600">
                Regulatory bodies, deposit protection, and trust scores
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Execution Speed</h3>
              <p className="text-gray-600">
                Order execution times, slippage, and fill rates
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Experience</h3>
              <p className="text-gray-600">
                Customer support, education, and user reviews
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Account Features</h3>
              <p className="text-gray-600">
                Minimum deposits, leverage, and account types
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Comparison
            </h2>
            <p className="text-xl text-gray-600">
              Select up to 3 brokers to compare side-by-side
            </p>
          </div>
          
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Broker Comparison Tool</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">Select First Broker</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Choose Broker
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">Select Second Broker</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Choose Broker
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-4">Select Third Broker (Optional)</p>
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-lg">
                    Choose Broker
                  </button>
                </div>
              </div>
              <div className="text-center mt-8">
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
                  Compare Selected Brokers
                </button>
              </div>
            </div>
          </Suspense>
        </div>
      </section>

      {/* Popular Comparisons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Comparisons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/compare/xm-vs-exness" className="group bg-gray-50 p-6 rounded-xl border hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                XM vs Exness
              </h3>
              <p className="text-gray-600 mb-4">
                Compare two popular forex brokers with competitive spreads
              </p>
              <div className="text-sm text-blue-600 font-medium">
                View Comparison →
              </div>
            </Link>

            <Link href="/compare/ic-markets-vs-pepperstone" className="group bg-gray-50 p-6 rounded-xl border hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                IC Markets vs Pepperstone
              </h3>
              <p className="text-gray-600 mb-4">
                ECN brokers comparison for professional traders
              </p>
              <div className="text-sm text-blue-600 font-medium">
                View Comparison →
              </div>
            </Link>

            <Link href="/compare/etoro-vs-plus500" className="group bg-gray-50 p-6 rounded-xl border hover:shadow-md transition-all">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                eToro vs Plus500
              </h3>
              <p className="text-gray-600 mb-4">
                Social trading vs CFD specialist comparison
              </p>
              <div className="text-sm text-blue-600 font-medium">
                View Comparison →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Our Comparison Works</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our advanced comparison algorithm analyzes real-time data to give you accurate insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Select Brokers</h3>
              <p className="text-blue-100">
                Choose up to 3 brokers from our database of 150+ reviewed brokers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analyze Data</h3>
              <p className="text-blue-100">
                Our system compares real-time spreads, fees, and performance metrics
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Decision</h3>
              <p className="text-blue-100">
                Get clear recommendations based on your trading style and preferences
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
