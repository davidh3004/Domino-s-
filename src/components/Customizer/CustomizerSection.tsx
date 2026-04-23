'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTableConfig } from '@/hooks/useTableConfig'
import {
  WOOD_COLORS, FELT_COLORS, LEG_COLORS,
  FeltColor, WoodPreset, LegColor, EngravingStyle, TableConfig,
} from '@/types/table'

const CustomizerScene = dynamic(() => import('./CustomizerScene'), { ssr: false })

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-3">
      {children}
    </p>
  )
}

function WoodCard({
  woodKey, color, label, selected, onClick,
}: { woodKey: WoodPreset; color: string; label: string; selected: boolean; onClick: () => void }) {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const light = `rgba(${Math.min(r + 55, 255)},${Math.min(g + 40, 255)},${Math.min(b + 25, 255)},0.5)`
  const dark = `rgba(${Math.max(r - 25, 0)},${Math.max(g - 20, 0)},${Math.max(b - 15, 0)},0.6)`
  const angle = woodKey === 'oak' ? '8deg' : woodKey === 'walnut' ? '12deg' : woodKey === 'mahogany' ? '6deg' : '15deg'

  return (
    <button
      onClick={onClick}
      className={`relative w-full rounded-xl overflow-hidden border-2 transition-all duration-200 text-left ${
        selected ? 'border-yellow-500 shadow-lg shadow-yellow-900/30' : 'border-zinc-800 hover:border-zinc-600'
      }`}
      style={{ backgroundColor: color }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(${angle}, transparent 0px, ${light} 2px, transparent 4px, ${dark} 7px, transparent 9px, ${light} 12px, transparent 16px)`,
        }}
      />
      <div className="relative z-10 px-3 py-3">
        <div className="h-8" />
        <p className="text-[11px] font-semibold text-white/90 drop-shadow leading-tight">{label}</p>
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3" stroke="white" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  )
}

function FeltSquare({
  color, label, selected, onClick,
}: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative aspect-square rounded-xl border-2 transition-all duration-150 hover:scale-105 ${
        selected ? 'border-yellow-500 scale-105 shadow-md shadow-yellow-900/40' : 'border-zinc-700 hover:border-zinc-500'
      }`}
      style={{ backgroundColor: color }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="white" strokeWidth={3}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}

function LegDot({
  color, label, selected, onClick,
}: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110 ${
        selected ? 'border-yellow-500 scale-110' : 'border-zinc-600 hover:border-zinc-400'
      }`}
      style={{ backgroundColor: color || '#888' }}
    />
  )
}

const ENGRAVING_STYLES: EngravingStyle[] = ['none', 'classic', 'modern', 'traditional', 'premium']

function EngravingThumb({
  style, label, selected, feltColor, onClick,
}: { style: EngravingStyle; label: string; selected: boolean; feltColor: string; onClick: () => void }) {
  const r = parseInt(feltColor.slice(1, 3), 16)
  const g = parseInt(feltColor.slice(3, 5), 16)
  const b = parseInt(feltColor.slice(5, 7), 16)
  const line = `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},0.4)`

  const patternStyle: React.CSSProperties = (() => {
    if (style === 'classic') return {
      backgroundImage: `repeating-linear-gradient(45deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 8px)`,
    }
    if (style === 'modern') return {
      backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
      backgroundSize: '10px 10px',
    }
    if (style === 'traditional') return {
      backgroundImage: `radial-gradient(circle at 50% 50%, ${line} 1px, transparent 4px)`,
      backgroundSize: '8px 8px',
    }
    if (style === 'premium') return {
      backgroundImage: `repeating-linear-gradient(30deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 6px), repeating-linear-gradient(-30deg, ${line} 0px, ${line} 1px, transparent 1px, transparent 6px)`,
    }
    return {}
  })()

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group shrink-0">
      <div
        className={`w-12 h-12 rounded-lg border-2 transition-all duration-150 ${
          selected ? 'border-yellow-500 shadow-md shadow-yellow-900/30' : 'border-zinc-700 hover:border-zinc-500'
        }`}
        style={{ backgroundColor: feltColor, ...patternStyle }}
      />
      <span className={`text-[10px] font-medium transition-colors ${selected ? 'text-yellow-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        {label}
      </span>
    </button>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-yellow-500' : 'bg-zinc-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-xs text-zinc-300">{label}</span>
    </label>
  )
}

function TableView2D({ config }: { config: TableConfig }) {
  const woodColor = WOOD_COLORS[config.wood]
  const feltColor = FELT_COLORS[config.felt]
  const size = 220
  const border = 34
  const cup = 13

  return (
    <div className="flex items-center justify-center w-full h-full relative" style={{ background: '#0a0806' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect x={0} y={0} width={size} height={size} rx={6} fill={woodColor} />
        <rect x={border} y={border} width={size - border * 2} height={size - border * 2} rx={3} fill={feltColor} />
        {config.accessories.cupHolders && (
          [
            [border / 2, border / 2],
            [size - border / 2, border / 2],
            [border / 2, size - border / 2],
            [size - border / 2, size - border / 2],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={cup} fill="#111" />
              <circle cx={cx} cy={cy} r={cup} fill="none" stroke="#ccc" strokeWidth={2} opacity={0.6} />
            </g>
          ))
        )}
        {config.logoUrl && (
          <image
            href={config.logoUrl}
            x={size / 2 - 36}
            y={size / 2 - 36}
            width={72}
            height={72}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
      <p className="absolute bottom-4 text-zinc-700 text-[11px]">Top-down view</p>
    </div>
  )
}

export default function CustomizerSection() {
  const t = useTranslations('customizer')
  const locale = useLocale()
  const router = useRouter()
  const { config, setFelt, setWood, setLegColor, setLogoUrl, setEngravingStyle, setAccessory, reset } = useTableConfig()
  const [view3D, setView3D] = useState(true)
  const [contactOpen, setContactOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<'wood' | 'felt' | 'engraving'>('wood')
  const prevLogoRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const woodKeys = Object.keys(WOOD_COLORS) as WoodPreset[]
  const feltKeys = Object.keys(FELT_COLORS) as FeltColor[]
  const legKeys = Object.keys(LEG_COLORS) as LegColor[]
  const feltColor = FELT_COLORS[config.felt]

  const legDisplayColor = (k: LegColor) => k === 'match-wood' ? WOOD_COLORS[config.wood] : LEG_COLORS[k]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevLogoRef.current) URL.revokeObjectURL(prevLogoRef.current)
    const url = URL.createObjectURL(file)
    prevLogoRef.current = url
    setLogoUrl(url)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveLogo = () => {
    if (prevLogoRef.current) URL.revokeObjectURL(prevLogoRef.current)
    prevLogoRef.current = null
    setLogoUrl(null)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-950 shrink-0">
        <Link href={`/${locale}`} className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back')}
        </Link>
        <span className="font-serif text-sm font-bold text-white">
          <span className="text-yellow-500">D</span>omino<span className="text-yellow-500">T</span>ables
        </span>
        <button
          onClick={() => router.push(`/${locale === 'en' ? 'es' : 'en'}/customize`)}
          className="text-[10px] font-bold px-2.5 py-1 rounded-md border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
        >
          {locale === 'en' ? 'ES' : 'EN'}
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL — Wood + Legs */}
        <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 bg-zinc-950 border-r border-zinc-800 overflow-y-auto p-5 gap-6">
          <div>
            <SectionLabel>{t('wood')}</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {woodKeys.map((k) => (
                <WoodCard
                  key={k}
                  woodKey={k}
                  color={WOOD_COLORS[k]}
                  label={t(`woodOptions.${k}`)}
                  selected={config.wood === k}
                  onClick={() => setWood(k)}
                />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>{t('legs')}</SectionLabel>
            <div className="flex flex-wrap gap-2.5">
              {legKeys.map((k) => (
                <LegDot
                  key={k}
                  color={legDisplayColor(k)}
                  label={t(`legOptions.${k}`)}
                  selected={config.legColor === k}
                  onClick={() => setLegColor(k)}
                />
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5">{t(`legOptions.${config.legColor}`)}</p>
          </div>
          <button onClick={reset} className="mt-auto text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors text-left">
            ↺ {t('resetBtn')}
          </button>
        </div>

        {/* CENTER — Canvas + 2D/3D toggle + engraving bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="relative flex-1">
            {/* 2D/3D toggle */}
            <div className="absolute top-3 right-3 z-10 flex rounded-lg border border-zinc-700 overflow-hidden text-[11px] font-semibold">
              <button
                onClick={() => setView3D(false)}
                className={`px-3 py-1.5 transition-colors ${!view3D ? 'bg-zinc-700 text-white' : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'}`}
              >
                {t('view2d')}
              </button>
              <button
                onClick={() => setView3D(true)}
                className={`px-3 py-1.5 transition-colors ${view3D ? 'bg-zinc-700 text-white' : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200'}`}
              >
                {t('view3d')}
              </button>
            </div>

            {view3D ? (
              <CustomizerScene config={config} />
            ) : (
              <div className="w-full h-full">
                <TableView2D config={config} />
              </div>
            )}
          </div>

          {/* Engraving bar */}
          <div className="hidden lg:flex items-center gap-5 px-6 py-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
            <SectionLabel>{t('engraving')}</SectionLabel>
            <div className="flex gap-5 overflow-x-auto">
              {ENGRAVING_STYLES.map((s) => (
                <EngravingThumb
                  key={s}
                  style={s}
                  label={t(`engravingOptions.${s}`)}
                  selected={config.engravingStyle === s}
                  feltColor={feltColor}
                  onClick={() => setEngravingStyle(s)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Felt + Logo + Accessories */}
        <div className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 bg-zinc-950 border-l border-zinc-800 overflow-y-auto p-5 gap-6">
          <div>
            <SectionLabel>{t('felt')}</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {feltKeys.map((k) => (
                <FeltSquare
                  key={k}
                  color={FELT_COLORS[k]}
                  label={t(`feltOptions.${k}`)}
                  selected={config.felt === k}
                  onClick={() => setFelt(k)}
                />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>{t('logo')}</SectionLabel>
            {config.logoUrl ? (
              <div className="flex items-center gap-3">
                <img src={config.logoUrl} alt="Logo" className="w-14 h-14 rounded-lg object-contain bg-zinc-800 p-1.5 border border-zinc-700" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] text-zinc-400">{t('logoApplied')}</p>
                  <div className="flex gap-2">
                    <label className="text-[11px] text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-2 py-1 rounded-md cursor-pointer transition-colors">
                      {t('changeLogo')}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <button onClick={handleRemoveLogo} className="text-[11px] text-red-500 hover:text-red-400 border border-red-900 hover:border-red-700 px-2 py-1 rounded-md transition-colors">
                      {t('removeLogo')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="flex items-center justify-center w-14 h-14 rounded-lg border-2 border-dashed border-zinc-700 group-hover:border-yellow-500/50 transition-colors bg-zinc-900 shrink-0">
                  <svg className="w-5 h-5 text-zinc-600 group-hover:text-yellow-500/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-300 group-hover:text-white transition-colors">{t('uploadLogo')}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{t('logoHint')}</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>

          <div>
            <SectionLabel>{t('accessories')}</SectionLabel>
            <div className="flex flex-col gap-2.5">
              <Toggle checked={config.accessories.cupHolders} onChange={(v) => setAccessory('cupHolders', v)} label={t('cupHolders')} />
              <Toggle checked={config.accessories.leds} onChange={(v) => setAccessory('leds', v)} label={t('leds')} />
              {config.accessories.leds && (
                <div className="flex items-center gap-3 pl-12">
                  <label className="text-[11px] text-zinc-500">{t('ledColor')}</label>
                  <input type="color" value={config.accessories.ledColor} onChange={(e) => setAccessory('ledColor', e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tab bar */}
      <div className="lg:hidden flex border-t border-zinc-800 bg-zinc-950 shrink-0">
        {(['wood', 'felt', 'engraving'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
              mobileTab === tab ? 'text-yellow-400 border-t-2 border-yellow-500 -mt-px' : 'text-zinc-500'
            }`}
          >
            {tab === 'wood' ? t('wood') : tab === 'felt' ? t('felt') : t('engraving')}
          </button>
        ))}
      </div>

      {/* Mobile tab content */}
      <div className="lg:hidden px-4 py-3 bg-zinc-950 border-t border-zinc-800 shrink-0 max-h-44 overflow-y-auto">
        {mobileTab === 'wood' && (
          <div className="grid grid-cols-4 gap-2">
            {woodKeys.map((k) => (
              <WoodCard key={k} woodKey={k} color={WOOD_COLORS[k]} label={t(`woodOptions.${k}`)} selected={config.wood === k} onClick={() => setWood(k)} />
            ))}
          </div>
        )}
        {mobileTab === 'felt' && (
          <div className="grid grid-cols-5 gap-2">
            {feltKeys.map((k) => (
              <FeltSquare key={k} color={FELT_COLORS[k]} label={t(`feltOptions.${k}`)} selected={config.felt === k} onClick={() => setFelt(k)} />
            ))}
          </div>
        )}
        {mobileTab === 'engraving' && (
          <div className="flex gap-4 overflow-x-auto pb-1">
            {ENGRAVING_STYLES.map((s) => (
              <EngravingThumb key={s} style={s} label={t(`engravingOptions.${s}`)} selected={config.engravingStyle === s} feltColor={feltColor} onClick={() => setEngravingStyle(s)} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
        <div className="hidden md:flex items-center gap-6">
          {[
            { icon: '🔨', text: t('badge1') },
            { icon: '⭐', text: t('badge2') },
            { icon: '🚚', text: t('badge3') },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-sm">{icon}</span>
              <span className="text-[11px] text-zinc-500 leading-tight max-w-[120px]">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-xl font-bold text-white font-serif">{t('price')}</span>
          <button
            onClick={() => setContactOpen(true)}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            {t('addToCart')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact drawer */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setContactOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-t-2xl lg:rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Order This Table</h3>
              <button onClick={() => setContactOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
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
    config.engravingStyle !== 'none' ? tc(`engravingOptions.${config.engravingStyle}`) : null,
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
        <p className="text-sm text-yellow-400 font-medium">{configSummary}</p>
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
        <input name="name" required placeholder={t('form.name')} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors" />
        <input name="phone" placeholder={t('form.phone')} className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors" />
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold py-2.5 rounded-xl transition-colors text-sm">
          {t('form.send')}
        </button>
      </form>
    </div>
  )
}
