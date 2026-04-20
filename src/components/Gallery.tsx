'use client'

import { useTranslations } from 'next-intl'

const GALLERY_ITEMS = [
  { bg: 'from-amber-900/40 to-amber-800/20', felt: '#2D6A4F', wood: '#5C3A1E', label: 'Walnut + Green' },
  { bg: 'from-zinc-800/60 to-zinc-700/30', felt: '#1A5276', wood: '#1A1A1A', label: 'Black + Blue' },
  { bg: 'from-red-900/30 to-red-800/20', felt: '#922B21', wood: '#8B2E16', label: 'Mahogany + Red' },
  { bg: 'from-amber-700/30 to-yellow-800/20', felt: '#616A6B', wood: '#C8A96E', label: 'Oak + Gray' },
  { bg: 'from-purple-900/30 to-purple-800/20', felt: '#6E2C49', wood: '#5C3A1E', label: 'Walnut + Burgundy' },
  { bg: 'from-zinc-900/60 to-zinc-800/30', felt: '#1C1C1C', wood: '#C8A96E', label: 'Oak + Black' },
]

function TablePreview({ felt, wood, bg, label }: (typeof GALLERY_ITEMS)[0]) {
  return (
    <div className={`relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br ${bg} border border-zinc-800 group hover:border-brand-gold/40 transition-all duration-300`}>
      {/* Mini table illustration */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          className="relative w-full max-w-[160px] aspect-square rounded-sm shadow-2xl"
          style={{ backgroundColor: wood }}
        >
          {/* Felt inner */}
          <div
            className="absolute inset-[14%] rounded-sm"
            style={{ backgroundColor: felt }}
          />
          {/* Corner dots (cup holders) */}
          {[
            'top-[6%] left-[6%]',
            'top-[6%] right-[6%]',
            'bottom-[6%] left-[6%]',
            'bottom-[6%] right-[6%]',
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-[10%] h-[10%] rounded-full bg-black/60`}
            />
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950/80 to-transparent">
        <p className="text-sm text-zinc-200 font-medium">{label}</p>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-gold/5 pointer-events-none" />
    </div>
  )
}

export default function Gallery() {
  const t = useTranslations('gallery')

  return (
    <section id="gallery" className="py-20 px-4 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {GALLERY_ITEMS.map((item) => (
            <TablePreview key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
