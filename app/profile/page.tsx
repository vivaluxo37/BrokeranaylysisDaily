import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'
import MegaMenuHeader from '@/components/MegaMenuHeader'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'

export const metadata: Metadata = {
  title: 'User Profile | Brokeranalysis',
  description: 'Manage your account settings, preferences, and trading profile on Brokeranalysis.',
  robots: 'noindex, nofollow', // Private user page
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MegaMenuHeader />
      <ProfilePageClient />
      <Footer />
      <ChatBubble />
    </div>
  )
}