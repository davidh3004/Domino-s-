'use client'

import { useTranslations } from 'next-intl'

const TESTIMONIALS = [
  { quoteKey: 't1Quote', nameKey: 't1Name', locationKey: 't1Location', initials: 'CM' },
  { quoteKey: 't2Quote', nameKey: 't2Name', locationKey: 't2Location', initials: 'ML' },
  { quoteKey: 't3Quote', nameKey: 't3Name', locationKey: 't3Location', initials: 'RP' },
]

const AVATAR_COLORS = ['bg-amber-700', 'bg-blue-700', 'bg-emerald-700']

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const t = useTranslations('testimonials')

  return (
    <section className="py-24 px-4 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quoteKey, nameKey, locationKey, initials }, i) => (
            <div
              key={i}
              className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-7 flex flex-col gap-4 hover:border-zinc-500 transition-colors duration-300"
            >
              <Stars />

              {/* Quote */}
              <blockquote className="text-zinc-300 text-sm leading-relaxed flex-1">
                &ldquo;{t(quoteKey as any)}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-700/60">
                <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t(nameKey as any)}</p>
                  <p className="text-zinc-500 text-xs">{t(locationKey as any)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
