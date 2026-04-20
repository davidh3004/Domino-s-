'use client'

import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-serif text-lg font-bold text-white">
            <span className="text-brand-gold">D</span>omino
            <span className="text-brand-gold">T</span>ables
          </p>
          <p className="text-zinc-500 text-sm mt-1">{t('tagline')}</p>
        </div>

        <p className="text-zinc-600 text-xs">
          © {new Date().getFullYear()} DominoTables. {t('rights')}
        </p>
      </div>
    </footer>
  )
}
