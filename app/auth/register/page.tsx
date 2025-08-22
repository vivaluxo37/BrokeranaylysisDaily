import { Metadata } from 'next'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Sign Up | Brokeranalysis - Create Your Trading Account',
  description: 'Create your free Brokeranalysis account to get personalized broker recommendations, save preferences, and access exclusive trading insights.',
  keywords: 'sign up, register, create account, trading account, broker recommendations, Brokeranalysis',
  openGraph: {
    title: 'Sign Up | Brokeranalysis',
    description: 'Create your account to access personalized broker recommendations and trading insights.',
    type: 'website',
  },
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join Brokeranalysis for personalized broker recommendations
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}