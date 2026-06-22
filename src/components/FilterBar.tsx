import { useState } from 'react'
import type { Category, Filters, PriceCategory } from '../types'
import { CATEGORY_META, FILTER_CATEGORIES, PRICES } from '../utils/constants'
import BottomSheet from './BottomSheet'

interface FilterBarProps {
  filters: Filters
  onChange: (next: Filters) => void
  districts: string[]
}

export default function FilterBar({ filters, onChange, districts }: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const extraActive =
    (filters.wifiOnly ? 1 : 0) +
    (filters.price !== 'Alle' ? 1 : 0) +
    (filters.district !== 'Alle' ? 1 : 0)

  function setCategory(cat: Category | 'Alle') {
    onChange({ ...filters, category: cat })
  }

  return (
    <div className="sticky top-[52px] z-20 bg-ice/85 backdrop-blur sm:top-[56px]">
      <div className="mx-auto max-w-5xl px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Kategorie-Chips, horizontal scrollbar */}
          <div className="no-scrollbar -mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
            <button
              className={`chip ${filters.category === 'Alle' ? 'chip-on' : 'chip-off'}`}
              onClick={() => setCategory('Alle')}
            >
              Alle
            </button>
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip ${filters.category === cat ? 'chip-on' : 'chip-off'}`}
                onClick={() => setCategory(cat)}
              >
                <span aria-hidden="true">{CATEGORY_META[cat].emoji}</span>
                {cat}
              </button>
            ))}
          </div>

          {/* Mehr-Filter-Button (öffnet Bottom Sheet) */}
          <button
            onClick={() => setSheetOpen(true)}
            className={`chip shrink-0 ${extraActive > 0 ? 'chip-on' : 'chip-off'}`}
            aria-label="Weitere Filter"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            Filter
            {extraActive > 0 && (
              <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-primary">
                {extraActive}
              </span>
            )}
          </button>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filter"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => onChange({ category: filters.category, wifiOnly: false, price: 'Alle', district: 'Alle' })}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Zurücksetzen
            </button>
            <button onClick={() => setSheetOpen(false)} className="btn-primary flex-1">
              Anzeigen
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* WLAN */}
          <FilterGroup label="WLAN">
            <ChoiceChip active={!filters.wifiOnly} onClick={() => onChange({ ...filters, wifiOnly: false })}>
              Alle
            </ChoiceChip>
            <ChoiceChip active={filters.wifiOnly} onClick={() => onChange({ ...filters, wifiOnly: true })}>
              📶 Nur mit WLAN
            </ChoiceChip>
          </FilterGroup>

          {/* Preis */}
          <FilterGroup label="Preis">
            <ChoiceChip active={filters.price === 'Alle'} onClick={() => onChange({ ...filters, price: 'Alle' })}>
              Alle
            </ChoiceChip>
            {PRICES.map((p: PriceCategory) => (
              <ChoiceChip key={p} active={filters.price === p} onClick={() => onChange({ ...filters, price: p })}>
                {p}
              </ChoiceChip>
            ))}
          </FilterGroup>

          {/* Stadtviertel */}
          <FilterGroup label="Stadtviertel">
            <ChoiceChip active={filters.district === 'Alle'} onClick={() => onChange({ ...filters, district: 'Alle' })}>
              Alle
            </ChoiceChip>
            {districts.map((d) => (
              <ChoiceChip key={d} active={filters.district === d} onClick={() => onChange({ ...filters, district: d })}>
                {d}
              </ChoiceChip>
            ))}
            {districts.length === 0 && (
              <p className="text-sm text-slate-400">Noch keine Stadtviertel erfasst.</p>
            )}
          </FilterGroup>
        </div>
      </BottomSheet>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function ChoiceChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button className={`chip ${active ? 'chip-on' : 'chip-off'}`} onClick={onClick}>
      {children}
    </button>
  )
}
