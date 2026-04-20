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
          {[
            { label: t('customize'), id: 'customize' },
            { label: t('gallery'), id: 'gallery' },
            { label: t('contact'), id: 'contact' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-zinc-300 hover:text-white transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={toggleLocale}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 transition-all"
        >
          {locale === 'en' ? 'ES' : 'EN'}
        </button>
      </div>
    </header>
  )
}
