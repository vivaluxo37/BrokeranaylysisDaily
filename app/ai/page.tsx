import { Metadata } from 'next'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import AIAssistantComponent from '@/components/AIAssistantComponent'

export const metadata: Metadata = {
  title: 'AI Trading Assistant - Get Personalized Broker Recommendations | Brokeranalysis',
  description: 'Get personalized forex broker recommendations from our AI assistant. Answer a few questions and receive tailored broker suggestions based on your trading needs.',
  keywords: 'AI trading assistant, broker recommendations, personalized broker selection, forex AI, trading assistant, broker finder',
  openGraph: {
    title: 'AI Trading Assistant - Get Personalized Broker Recommendations',
    description: 'Get personalized forex broker recommendations from our AI assistant based on your trading needs.',
    type: 'website',
    url: '/ai',
    siteName: 'Brokeranalysis',
    images: [
      {
        url: '/images/tools/ai-assistant-og.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Trading Assistant'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Assistant - Get Personalized Broker Recommendations',
    description: 'Get personalized forex broker recommendations from our AI assistant based on your trading needs.',
    images: ['/images/tools/ai-assistant-og.jpg']
  }
}

export default function AIAssistantPage() {
  return (
    <>
      <MegaMenuHeader />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-900 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                AI Trading Assistant
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Get personalized forex broker recommendations powered by artificial intelligence. 
                Our AI analyzes your trading preferences and matches you with the perfect broker.
              </p>
              
              {/* Quick Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">🤖</div>
                  <div className="text-sm text-purple-100">AI Powered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">⚡</div>
                  <div className="text-sm text-purple-100">Instant Results</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">🎯</div>
                  <div className="text-sm text-purple-100">Personalized</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-200 mb-2">🆓</div>
                  <div className="text-sm text-purple-100">100% Free</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <AIAssistantComponent />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How Our AI Assistant Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced AI algorithm analyzes multiple factors to provide you with the most suitable broker recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Answer Questions</h3>
                <p className="text-gray-600">
                  Tell us about your trading experience, preferred instruments, budget, 
                  and location. Our AI needs this information to understand your needs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes 100+ broker characteristics including regulation, spreads, 
                  platforms, and features to find the best matches for your profile.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Get Recommendations</h3>
                <p className="text-gray-600">
                  Receive personalized broker recommendations with detailed explanations 
                  of why each broker is suitable for your specific trading needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Assistant Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI assistant considers multiple factors to provide the most accurate recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Regulation Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Regulation Analysis</h3>
                <p className="text-gray-600">
                  Analyzes regulatory compliance and safety measures to ensure you're matched 
                  with properly licensed and regulated brokers.
                </p>
              </div>

              {/* Trading Costs */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Cost Optimization</h3>
                <p className="text-gray-600">
                  Compares spreads, commissions, and fees across brokers to find the most 
                  cost-effective options for your trading volume.
                </p>
              </div>

              {/* Platform Matching */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Platform Matching</h3>
                <p className="text-gray-600">
                  Matches you with brokers offering your preferred trading platforms 
                  and tools based on your experience level.
                </p>
              </div>

              {/* Geographic Compliance */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Geographic Compliance</h3>
                <p className="text-gray-600">
                  Ensures recommended brokers accept clients from your country and 
                  comply with local regulations.
                </p>
              </div>

              {/* Trading Style Analysis */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trading Style Analysis</h3>
                <p className="text-gray-600">
                  Analyzes your trading frequency, instruments, and strategy to match 
                  you with brokers optimized for your style.
                </p>
              </div>

              {/* Real-time Updates */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Data</h3>
                <p className="text-gray-600">
                  Uses up-to-date broker information including current spreads, 
                  promotions, and regulatory status for accurate recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is the AI assistant really free?
                </h3>
                <p className="text-gray-600">
                  Yes, our AI assistant is completely free to use. We may earn affiliate commissions 
                  if you sign up with recommended brokers, but this doesn't affect our recommendations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How accurate are the recommendations?
                </h3>
                <p className="text-gray-600">
                  Our AI analyzes over 100 broker characteristics and is continuously updated with 
                  the latest market data. However, we recommend doing your own research before making final decisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I get recommendations for specific countries?
                </h3>
                <p className="text-gray-600">
                  Yes, our AI considers your location and only recommends brokers that accept 
                  clients from your country and comply with local regulations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What if I don't like the recommendations?
                </h3>
                <p className="text-gray-600">
                  You can adjust your preferences and get new recommendations. Our AI learns from 
                  feedback to provide better matches over time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </>
  )
}
