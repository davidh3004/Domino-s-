'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTableConfig } from '@/hooks/useTableConfig'

export default function Contact() {
  const t = useTranslations('contact')
  const tc = useTranslations('customizer')
  const { config } = useTableConfig()
  const [sent, setSent] = useState(false)

  const configSummary = [
    tc(`feltOptions.${config.felt}`),
    tc(`woodOptions.${config.wood}`),
    tc(`legOptions.${config.legColor}`),
    config.accessories.cupHolders ? tc('cupHolders') : null,
    config.accessories.leds ? tc('leds') : null,
  ].filter(Boolean).join(' · ')

  const whatsappText = encodeURIComponent(
    `Hola! Me interesa ordenar una mesa de dominó con la siguiente configuración:\n${configSummary}`
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
    const subject = encodeURIComponent('Order Inquiry - DominoTables')
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nConfig: ${configSummary}\n\n${message}`)
    window.open(`mailto:contact@dominotables.com?subject=${subject}&body=${body}`, '_blank')
    setSent(true)
  }

  return (
    <section id="contact" className="py-20 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {t('subtitle')}
          </p>
          {/* Config preview */}
          <div className="inline-block mt-4 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-xs text-zinc-500 mb-1">{tc('summary')}</p>
            <p className="text-sm text-brand-gold font-medium">{configSummary}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/1XXXXXXXXXX?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-5 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-green-900/30"
          >
            <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div>
              <p className="text-lg">{t('whatsapp')}</p>
              <p className="text-sm text-green-200 font-normal">Respuesta rápida · Fast reply</p>
            </div>
          </a>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col gap-4">
            {sent ? (
              <p className="text-green-400 text-center py-8">{t('email')} ✓</p>
            ) : (
              <>
                <input
                  name="name"
                  required
                  placeholder={t('form.name')}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition-colors"
                />
                <input
                  name="phone"
                  placeholder={t('form.phone')}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition-colors"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder={t('form.messagePlaceholder')}
                  defaultValue={configSummary}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="bg-brand-gold hover:bg-yellow-400 text-zinc-900 font-semibold py-3 rounded-xl transition-colors"
                >
                  {t('form.send')}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
