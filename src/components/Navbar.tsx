'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleLocale = () => {
    const next = locale === 'en' ? 'es' : 'en'
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/') || `/${next}`)
  }

  const isCustomizePage = pathname.includes('/customize')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-xl font-bold text-white tracking-wide">
          <span className="text-brand-gold">D</span>omino
          <span className="text-brand-gold">T</span>ables
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={`/${locale}/customize`}
            className="text-sm text-zinc-300 hover:text-white transition-colors"
          >
            {t('customize')}
          </Link>
          {!isCustomizePage && (
            <>
              <button
                onClick={() => scrollTo('gallery')}
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                {t('gallery')}
              </button>
              <button
                onClick={() => scrollTo('contact')}
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                {t('contact')}
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 transition-all"
          >
            {locale === 'en' ? 'ES' : 'EN'}
          </button>

          {/* Mobile: customize CTA */}
          <Link
            href={`/${locale}/customize`}
            className="md:hidden text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-gold text-zinc-900 hover:bg-yellow-400 transition-colors"
          >
            {t('customize')}
          </Link>
        </div>
      </div>
    </header>
  )
}
