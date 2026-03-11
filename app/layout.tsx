import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'NETPRO — Bosch Professional værktøj til fagfolk',
    template: '%s | NETPRO',
  },
  description:
    'Køb Bosch Professional værktøj til priser under danske forhandlere. Gratis fragt, minimum 3 års garanti og lynhurtig levering fra Amazon.de.',
  keywords: ['Bosch Professional', 'elværktøj', 'professionelt værktøj', 'Danmark'],
  openGraph: {
    siteName: 'NETPRO',
    locale: 'da_DK',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="antialiased bg-white text-[#1A1A1A]">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
