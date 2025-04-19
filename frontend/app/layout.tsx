import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chex',
  description: 'Your personal health and wellness companion',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
