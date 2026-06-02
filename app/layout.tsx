import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
})

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Соколова Любовь — Финансовый директор для МСБ',
  description:
    'Помогаю собственникам МСБ выстроить систему управления финансами. Управленческий учёт, финансовый анализ, сопровождение бизнеса.',
  keywords: 'финансовый директор, управленческий учёт, МСБ, малый бизнес, финансы',
  openGraph: {
    title: 'Соколова Любовь — Финансовый директор для МСБ',
    description: 'Финансовая ясность для вашего бизнеса',
    type: 'website',
  },
}

// Viewport вынесен в отдельный экспорт (требование Next.js 14)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#141E30',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
