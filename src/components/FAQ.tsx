'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const FAQ_KEYS = ['1', '2', '3', '4', '5', '6'] as const

export default function FAQ() {
  const t = useTranslations('faq')
  const [open, setOpen] = useState<string | null>('1')

  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key))

  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_KEYS.map((key) => {
            const isOpen = open === key
            return (
              <div
                key={key}
                className={`rounded-xl border transition-all duration-200 ${
                  isOpen ? 'border-brand-gold/40 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'
                }`}
              >
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                >
                  <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
                    {t(`q${key}` as any)}
                  </span>
                  <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    isOpen ? 'border-brand-gold text-brand-gold rotate-45' : 'border-zinc-600 text-zinc-400'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {t(`a${key}` as any)}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
