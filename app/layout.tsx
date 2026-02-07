import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Career Compass - Your Placement Preparation Partner',
  description: 'AI-powered placement preparation dashboard for tier-2/3 college students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
