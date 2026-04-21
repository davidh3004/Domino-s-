'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const STEPS = [
  {
    numberKey: 'step1Number',
    titleKey: 'step1Title',
    descKey: 'step1Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    numberKey: 'step2Number',
    titleKey: 'step2Title',
    descKey: 'step2Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    numberKey: 'step3Number',
    titleKey: 'step3Title',
    descKey: 'step3Desc',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const t = useTranslations('howItWorks')
  const locale = useLocale()
  const router = useRouter()

  return (
    <section className="py-24 px-4 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-brand-gold/20 via-brand-gold/60 to-brand-gold/20" />

          {STEPS.map(({ numberKey, titleKey, descKey, icon }, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Step number badge */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:border-brand-gold/50 transition-colors duration-300 flex items-center justify-center text-brand-gold">
                  {icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-gold text-zinc-900 text-xs font-bold flex items-center justify-center">
                  {t(numberKey as any)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{t(titleKey as any)}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{t(descKey as any)}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => router.push(`/${locale}/customize`)}
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-zinc-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 text-sm"
          >
            {t('cta')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
