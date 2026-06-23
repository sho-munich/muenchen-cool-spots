import type { Category, Filters } from '../types'
import { CATEGORY_META, FILTER_CATEGORIES } from '../utils/constants'

interface FilterBarProps {
  filters: Filters
  onChange: (next: Filters) => void
  /** Stadtviertel aus der DB – als Autocomplete-Vorschläge (gratis, via <datalist>). */
  districts: string[]
  resultCount: number
}

export const DEFAULT_FILTERS: Filters = {
  category: 'Alle',
  wifiOnly: false,
  price: 'Alle',
  location: '',
}

const CATEGORY_OPTIONS: (Category | 'Alle')[] = ['Alle', ...FILTER_CATEGORIES]
const PRICE_OPTIONS = ['Alle', '€', '€€', '€€€'] as const

export default function FilterBar({ filters, onChange, districts, resultCount }: FilterBarProps) {
  const anyActive =
    filters.category !== 'Alle' ||
    filters.wifiOnly ||
    filters.price !== 'Alle' ||
    filters.location.trim() !== ''

  return (
    <section className="mx-auto max-w-5xl px-4 pt-3">
      <div className="space-y-3 rounded-2xl border border-sky-100 bg-white/85 p-3 shadow-card backdrop-blur">
        {/* ---- Standort-Suche (Freitext, kein externer Service) ---- */}
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            list="district-suggestions"
            aria-label="Nach Stadtviertel oder Postleitzahl suchen"
            placeholder="Stadtviertel oder PLZ (z.B. Schwabing)"
            className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-11 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-accent/40"
          />
          {filters.location && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, location: '' })}
              aria-label="Standortsuche löschen"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <datalist id="district-suggestions">
            {districts.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        {/* ---- Kategorie-Grid (alle auf einmal sichtbar, kein Scrollen) ---- */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CATEGORY_OPTIONS.map((cat) => {
            const active = filters.category === cat
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ ...filters, category: cat })}
                className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border text-sm font-bold transition active:scale-[0.98] ${
                  cat === 'Alle' ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  active
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-accent hover:text-primary'
                }`}
              >
                {cat !== 'Alle' && <span aria-hidden="true">{CATEGORY_META[cat].emoji}</span>}
                {cat}
              </button>
            )
          })}
        </div>

        {/* ---- WLAN-Toggle + Preis ---- */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            aria-pressed={filters.wifiOnly}
            onClick={() => onChange({ ...filters, wifiOnly: !filters.wifiOnly })}
            className={`flex min-h-[48px] items-center justify-center gap-2 rounded-xl border text-sm font-bold transition active:scale-[0.98] ${
              filters.wifiOnly
                ? 'border-confirm bg-confirm text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-700 hover:border-accent hover:text-primary'
            }`}
          >
            <span aria-hidden="true">📶</span> Nur mit WLAN
          </button>

          <div className="grid grid-cols-4 gap-2">
            {PRICE_OPTIONS.map((p) => {
              const active = filters.price === p
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ ...filters, price: p })}
                  className={`min-h-[48px] rounded-xl border text-sm font-bold transition active:scale-[0.98] ${
                    active
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-accent hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        {/* ---- Ergebnis-Zähler + Reset (nur wenn Filter aktiv) ---- */}
        {anyActive && (
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
            <span className="text-sm font-medium text-slate-500">
              {resultCount} {resultCount === 1 ? 'Spot' : 'Spots'} gefunden
            </span>
            <button
              type="button"
              onClick={() => onChange(DEFAULT_FILTERS)}
              className="inline-flex min-h-[48px] items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-primary hover:bg-sky-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 2v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
              </svg>
              Zurücksetzen
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
