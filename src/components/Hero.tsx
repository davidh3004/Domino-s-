'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const router = useRouter()

  const scrollToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gold accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-60" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-gold/4 rounded-full blur-3xl pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/8 text-brand-gold text-xs font-medium tracking-wider uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
          {t('title')}{' '}
          <br className="hidden md:block" />
          <span className="text-brand-gold">{t('titleAccent')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push(`/${locale}/customize`)}
            className="group inline-flex items-center gap-3 bg-brand-gold hover:bg-yellow-400 text-zinc-900 font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-yellow-900/30 w-full sm:w-auto justify-center"
          >
            {t('cta')}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <button
            onClick={scrollToGallery}
            className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium px-8 py-4 rounded-xl text-base transition-all duration-200 w-full sm:w-auto justify-center"
          >
            {t('ctaSecondary')}
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-14 pt-8 border-t border-zinc-800/60">
          {[
            { value: '100+', label: 'Tables Built' },
            { value: '100%', label: 'Handcrafted' },
            { value: '1 yr', label: 'Warranty' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-brand-gold font-serif">{value}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — direct child of section so absolute positioning works correctly */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce pointer-events-none">
        <span className="text-zinc-600 text-xs tracking-widest uppercase">{t('scroll')}</span>
        <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
