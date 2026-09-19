
import Navbar from '@/components/Navbar'

import './globals.css'
import { Fraunces, Inter } from 'next/font/google'
import GlobalState from '@/context'

const bodyFont = Inter({ subsets: ['latin'], variable: '--font-body' })
const displayFont = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

export const metadata = {
  title: 'Ecommercery',
  description: 'Fashion, considered.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-sans bg-canvas text-ink`}>
        <GlobalState>
          <Navbar></Navbar>
          <main className='flex min-h-screen flex-col mt-[80px]'>{children}</main>
        </GlobalState>
      </body>
    </html>
  )
}
