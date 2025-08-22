import type { Metadata } from 'next'
import ProfilePageClient from './ProfilePageClient'

export const metadata: Metadata = {
  title: 'User Profile | Brokeranalysis',
  description: 'Manage your account settings, preferences, and trading profile on Brokeranalysis.',
  robots: 'noindex, nofollow', // Private user page
}

export default function ProfilePage() {
  return <ProfilePageClient />
}