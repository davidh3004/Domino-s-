'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useTableConfig } from '@/hooks/useTableConfig'
import ControlPanel from './ControlPanel'

const CustomizerScene = dynamic(() => import('./CustomizerScene'), { ssr: false })

export default function CustomizerSection() {
  const t = useTranslations('customizer')
  const locale = useLocale()
  const { config } = useTableConfig()
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm shrink-0">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>

        <div className="hidden md:block text-center">
          <h1 className="text-sm font-semibold text-white">{t('title')}</h1>
          <p className="text-xs text-zinc-500">{t('rotate')}</p>
        </div>

        <div className="text-xs text-zinc-600 hidden md:block">
          DominoTables
        </div>
        <div className="md:hidden w-16" />
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* 3D Canvas */}
        <div className="flex-1 lg:flex-[3] h-[45vh] lg:h-auto relative">
          <CustomizerScene config={config} />

          {/* Mobile hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 lg:hidden">
            <span className="text-zinc-600 text-xs bg-zinc-950/80 px-3 py-1 rounded-full">
              {t('rotate')}
            </span>
          </div>
        </div>

        {/* Control sidebar */}
        <div className="lg:flex-[1.1] lg:max-w-sm xl:max-w-md flex flex-col border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900 overflow-hidden">
          {/* Panel header */}
          <div className="px-6 py-4 border-b border-zinc-800 shrink-0">
            <h2 className="text-sm font-semibold text-white">{t('title')}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{t('subtitle')}</p>
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <ControlPanel onContact={() => setContactOpen(true)} />
          </div>
        </div>
      </div>

      {/* Contact slide-up drawer */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setContactOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-t-2xl lg:rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Order This Table</h3>
              <button
                onClick={() => setContactOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ContactDrawer onClose={() => setContactOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

function ContactDrawer({ onClose }: { onClose: () => void }) {
  const tc = useTranslations('customizer')
  const t = useTranslations('contact')
  const { config } = useTableConfig()

  const configSummary = [
    tc(`feltOptions.${config.felt}`),
    tc(`woodOptions.${config.wood}`),
    tc(`legOptions.${config.legColor}`),
    config.accessories.cupHolders ? tc('cupHolders') : null,
    config.accessories.leds ? tc('leds') : null,
    config.logoUrl ? tc('logoApplied') : null,
  ].filter(Boolean).join(' · ')

  const whatsappText = encodeURIComponent(
    `Hola! Me interesa ordenar una mesa de dominó con la siguiente configuración:\n${configSummary}`
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3">
        <p className="text-xs text-zinc-500 mb-1">{tc('summary')}</p>
        <p className="text-sm text-brand-gold font-medium">{configSummary}</p>
      </div>

      <a
        href={`https://wa.me/1XXXXXXXXXX?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors"
      >
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {t('whatsapp')}
      </a>

      <p className="text-xs text-zinc-500 text-center">or send us your details by email</p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const name = (form.elements.namedItem('name') as HTMLInputElement).value
          const phone = (form.elements.namedItem('phone') as HTMLInputElement).value
          const subject = encodeURIComponent('Order Inquiry - DominoTables')
          const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nConfig: ${configSummary}`)
          window.open(`mailto:contact@dominotables.com?subject=${subject}&body=${body}`, '_blank')
          onClose()
        }}
        className="flex flex-col gap-3"
      >
        <input
          name="name"
          required
          placeholder={t('form.name')}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition-colors"
        />
        <input
          name="phone"
          placeholder={t('form.phone')}
          className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition-colors"
        />
        <button
          type="submit"
          className="bg-brand-gold hover:bg-yellow-400 text-zinc-900 font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {t('form.send')}
        </button>
      </form>
    </div>
  )
}
