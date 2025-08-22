import { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Login | Brokeranalysis - Access Your Trading Account',
  description: 'Sign in to your Brokeranalysis account to access personalized broker recommendations, save your preferences, and track your trading journey.',
  keywords: 'login, sign in, trading account, broker recommendations, Brokeranalysis',
  openGraph: {
    title: 'Login | Brokeranalysis',
    description: 'Sign in to access personalized broker recommendations and trading insights.',
    type: 'website',
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Brokeranalysis account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}