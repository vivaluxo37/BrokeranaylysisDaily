import { Metadata } from 'next'
import ForgotPasswordForm from './ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password | Brokeranalysis - Recover Your Account',
  description: 'Reset your Brokeranalysis account password. Enter your email to receive password reset instructions.',
  keywords: 'reset password, forgot password, account recovery, Brokeranalysis',
  openGraph: {
    title: 'Reset Password | Brokeranalysis',
    description: 'Reset your password to regain access to your Brokeranalysis account.',
    type: 'website',
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}