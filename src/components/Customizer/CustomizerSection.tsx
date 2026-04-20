'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useTableConfig } from '@/hooks/useTableConfig'
import ControlPanel from './ControlPanel'

const CustomizerScene = dynamic(() => import('./CustomizerScene'), { ssr: false })

export default function CustomizerSection() {
  const t = useTranslations('customizer')
  const { config } = useTableConfig()

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="customize" className="py-20 px-4 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {t('subtitle')}
          </p>
          <p className="text-zinc-600 text-xs mt-2">{t('rotate')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* 3D Canvas */}
          <div className="w-full lg:w-3/5 h-[480px] lg:h-[560px]">
            <CustomizerScene config={config} />
          </div>

          {/* Control Panel */}
          <div className="w-full lg:w-2/5 lg:h-[560px] bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <ControlPanel onContact={scrollToContact} />
          </div>
        </div>
      </div>
    </section>
  )
}
