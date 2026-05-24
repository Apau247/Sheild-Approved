import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shield Approved | Iron Vault Security',
  description: 'Premium Shield verification, cargo tracking, and secure contact for Shield Approved.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
