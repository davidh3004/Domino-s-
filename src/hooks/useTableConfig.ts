'use client'

import { create } from 'zustand'
import { TableConfig, DEFAULT_CONFIG } from '@/types/table'

interface TableConfigStore {
  config: TableConfig
  setFelt: (felt: TableConfig['felt']) => void
  setWood: (wood: TableConfig['wood']) => void
  setLegColor: (legColor: TableConfig['legColor']) => void
  setAccessory: <K extends keyof TableConfig['accessories']>(
    key: K,
    value: TableConfig['accessories'][K]
  ) => void
  reset: () => void
}

export const useTableConfig = create<TableConfigStore>((set) => ({
  config: DEFAULT_CONFIG,
  setFelt: (felt) => set((s) => ({ config: { ...s.config, felt } })),
  setWood: (wood) => set((s) => ({ config: { ...s.config, wood } })),
  setLegColor: (legColor) => set((s) => ({ config: { ...s.config, legColor } })),
  setAccessory: (key, value) =>
    set((s) => ({
      config: {
        ...s.config,
        accessories: { ...s.config.accessories, [key]: value },
      },
    })),
  reset: () => set({ config: DEFAULT_CONFIG }),
}))
