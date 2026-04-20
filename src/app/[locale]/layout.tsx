import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'

export const metadata: Metadata = {
  title: 'DominoTables — Premium Handcrafted Domino Tables',
  description:
    'Custom handcrafted domino tables from Dominican Republic. Choose your felt, wood, and accessories with our 3D configurator.',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="bg-zinc-950 text-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
