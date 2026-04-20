'use client'

import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')

  const scrollToCustomizer = () => {
    document.getElementById('customize')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Decorative domino dots pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-brand-gold" />
        <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-brand-gold" />
        <div className="absolute top-1/2 left-1/5 w-5 h-5 rounded-full bg-brand-gold" />
        <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-brand-gold" />
        <div className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-brand-gold" />
        <div className="absolute bottom-1/4 left-1/2 w-4 h-4 rounded-full bg-brand-gold" />
        <div className="absolute bottom-1/3 right-1/5 w-5 h-5 rounded-full bg-brand-gold" />
      </div>

      {/* Gold accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-medium tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
          {t('title')}{' '}
          <span className="text-brand-gold">{t('titleAccent')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTA */}
        <button
          onClick={scrollToCustomizer}
          className="group inline-flex items-center gap-3 bg-brand-gold hover:bg-yellow-400 text-zinc-900 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-yellow-900/30"
        >
          {t('cta')}
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-zinc-600 text-xs tracking-widest uppercase">{t('scroll')}</span>
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
