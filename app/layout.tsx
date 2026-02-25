import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '@/components/providers/ReduxProvider'
import ThemeSync     from '@/components/providers/ThemeSync'

export const metadata: Metadata = {
  title:       'Projects — Todo Board',
  description: 'A project management kanban board',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-exo antialiased">
        <ReduxProvider>
          <ThemeSync />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}