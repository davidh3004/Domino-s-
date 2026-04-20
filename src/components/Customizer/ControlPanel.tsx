'use client'

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

interface SwatchProps {
  color: string
  label: string
  selected: boolean
  onClick: () => void
}

function Swatch({ color, label, selected, onClick }: SwatchProps) {
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
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
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
  const { config, setFelt, setWood, setLegColor, setAccessory, reset } = useTableConfig()

  const woodKeys = Object.keys(WOOD_COLORS) as WoodPreset[]
  const feltKeys = Object.keys(FELT_COLORS) as FeltColor[]
  const legKeys = Object.keys(LEG_COLORS) as LegColor[]

  const legDisplayColor = (k: LegColor) =>
    k === 'match-wood' ? WOOD_COLORS[config.wood] : LEG_COLORS[k]

  const summaryParts = [
    t(`feltOptions.${config.felt}`),
    t(`woodOptions.${config.wood}`),
    t(`legOptions.${config.legColor}`),
    config.accessories.cupHolders ? t('cupHolders') : null,
    config.accessories.leds ? t('leds') : null,
    config.accessories.decorativeSurface ? t('decorativeSurface') : null,
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
          <Toggle
            checked={config.accessories.decorativeSurface}
            onChange={(v) => setAccessory('decorativeSurface', v)}
            label={t('decorativeSurface')}
          />
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
