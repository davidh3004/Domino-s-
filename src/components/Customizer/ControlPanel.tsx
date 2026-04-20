'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useTableConfig } from '@/hooks/useTableConfig'
import {
  WOOD_COLORS,
  FELT_COLORS,
  LEG_COLORS,
  FeltColor,
  WoodPreset,
  LegColor,
} from '@/types/table'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
      {children}
    </h3>
  )
}

function Swatch({
  color, label, selected, onClick,
}: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative w-9 h-9 rounded-full border-2 transition-all duration-150 hover:scale-110 focus:outline-none ${
        selected
          ? 'border-brand-gold scale-110 shadow-lg shadow-yellow-900/40'
          : 'border-transparent'
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

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-brand-gold' : 'bg-zinc-600'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-sm text-zinc-200">{label}</span>
    </label>
  )
}

export default function ControlPanel({ onContact }: { onContact: () => void }) {
  const t = useTranslations('customizer')
  const { config, setFelt, setWood, setLegColor, setLogoUrl, setAccessory, reset } = useTableConfig()
  const prevLogoRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const woodKeys = Object.keys(WOOD_COLORS) as WoodPreset[]
  const feltKeys = Object.keys(FELT_COLORS) as FeltColor[]
  const legKeys = Object.keys(LEG_COLORS) as LegColor[]

  const legDisplayColor = (k: LegColor) =>
    k === 'match-wood' ? WOOD_COLORS[config.wood] : LEG_COLORS[k]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (prevLogoRef.current) URL.revokeObjectURL(prevLogoRef.current)
    const url = URL.createObjectURL(file)
    prevLogoRef.current = url
    setLogoUrl(url)
    // reset input so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveLogo = () => {
    if (prevLogoRef.current) URL.revokeObjectURL(prevLogoRef.current)
    prevLogoRef.current = null
    setLogoUrl(null)
  }

  const summaryParts = [
    t(`feltOptions.${config.felt}`),
    t(`woodOptions.${config.wood}`),
    t(`legOptions.${config.legColor}`),
    config.accessories.cupHolders ? t('cupHolders') : null,
    config.accessories.leds ? t('leds') : null,
    config.logoUrl ? t('logoApplied') : null,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
      {/* Felt */}
      <div>
        <SectionTitle>{t('felt')}</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {feltKeys.map((k) => (
            <Swatch
              key={k}
              color={FELT_COLORS[k]}
              label={t(`feltOptions.${k}`)}
              selected={config.felt === k}
              onClick={() => setFelt(k)}
            />
          ))}
        </div>
      </div>

      {/* Wood */}
      <div>
        <SectionTitle>{t('wood')}</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {woodKeys.map((k) => (
            <Swatch
              key={k}
              color={WOOD_COLORS[k]}
              label={t(`woodOptions.${k}`)}
              selected={config.wood === k}
              onClick={() => setWood(k)}
            />
          ))}
        </div>
      </div>

      {/* Legs */}
      <div>
        <SectionTitle>{t('legs')}</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {legKeys.map((k) => (
            <Swatch
              key={k}
              color={legDisplayColor(k)}
              label={t(`legOptions.${k}`)}
              selected={config.legColor === k}
              onClick={() => setLegColor(k)}
            />
          ))}
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <SectionTitle>{t('logo')}</SectionTitle>
        {config.logoUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={config.logoUrl}
              alt="Logo"
              className="w-16 h-16 rounded-xl object-contain bg-zinc-700/60 p-1.5 border border-zinc-600"
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-zinc-300">{t('logoApplied')}</p>
              <div className="flex gap-2">
                <label className="text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-600 hover:border-zinc-400 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors">
                  {t('changeLogo')}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                <button
                  onClick={handleRemoveLogo}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {t('removeLogo')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed border-zinc-600 group-hover:border-brand-gold transition-colors bg-zinc-800/40 shrink-0">
              <svg className="w-6 h-6 text-zinc-500 group-hover:text-brand-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-200 group-hover:text-white transition-colors">{t('uploadLogo')}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{t('logoHint')}</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        )}
      </div>

      {/* Accessories */}
      <div>
        <SectionTitle>{t('accessories')}</SectionTitle>
        <div className="flex flex-col gap-3">
          <Toggle
            checked={config.accessories.cupHolders}
            onChange={(v) => setAccessory('cupHolders', v)}
            label={t('cupHolders')}
          />
          <Toggle
            checked={config.accessories.leds}
            onChange={(v) => setAccessory('leds', v)}
            label={t('leds')}
          />
          {config.accessories.leds && (
            <div className="flex items-center gap-3 pl-14">
              <label className="text-xs text-zinc-400">{t('ledColor')}</label>
              <input
                type="color"
                value={config.accessories.ledColor}
                onChange={(e) => setAccessory('ledColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 p-4">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2">{t('summary')}</p>
        <p className="text-sm text-zinc-200 leading-relaxed">{summaryParts.join(' · ')}</p>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <button
          onClick={onContact}
          className="flex-1 bg-brand-gold hover:bg-yellow-500 text-zinc-900 font-semibold py-3 px-4 rounded-xl transition-colors duration-150 text-sm"
        >
          {t('contactBtn')}
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl border border-zinc-600 text-zinc-400 hover:text-zinc-200 hover:border-zinc-400 transition-colors text-sm"
        >
          {t('resetBtn')}
        </button>
      </div>
    </div>
  )
}
