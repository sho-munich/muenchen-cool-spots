import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../App'
import AddSpotFAB from '../components/AddSpotFAB'
import FilterBar, { DEFAULT_FILTERS } from '../components/FilterBar'
import SpotList from '../components/SpotList'
import StatsBanner from '../components/StatsBanner'
import SubmitSpotSheet from '../components/SubmitSpotSheet'

export default function HomePage() {
  const { spots, loading, error, demoMode, addSpot } = useAppContext()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [submitOpen, setSubmitOpen] = useState(false)

  useEffect(() => {
    document.title = 'München Cool Spots ❄️'
  }, [])

  // Stadtviertel dynamisch aus den Daten
  const districts = useMemo(() => {
    const set = new Set<string>()
    for (const s of spots) if (s.district) set.add(s.district)
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'de'))
  }, [spots])

  const filtered = useMemo(() => {
    const q = filters.location.trim().toLowerCase()
    return spots.filter((s) => {
      if (filters.category !== 'Alle' && s.category !== filters.category) return false
      if (filters.wifiOnly && !s.wifi) return false
      if (filters.price !== 'Alle' && s.price_category !== filters.price) return false
      if (q) {
        // Freitext-Match auf Stadtviertel + Adresse (matcht z.B. "Schwabing" oder "80331")
        const haystack = `${s.district ?? ''} ${s.address}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [spots, filters])

  return (
    <main className="mx-auto max-w-5xl">
      <section className="px-4 pt-5">
        <h1 className="text-xl font-extrabold leading-snug text-ink sm:text-2xl">
          Bleib cool, auch wenn München glüht. ❄️
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Finde Cafés, Restaurants &amp; Co-Working-Spaces mit Klimaanlage – zum{' '}
          <strong className="font-semibold text-ink">Arbeiten</strong>,{' '}
          <strong className="font-semibold text-ink">Abhängen</strong> oder{' '}
          <strong className="font-semibold text-ink">Daten</strong> an heißen Tagen.
        </p>

        <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-sky-100 bg-white/70 p-3.5 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-slate-600">
            <strong className="font-semibold text-ink">Diese Karte lebt von dir.</strong>{' '}
            Jeder Spot ist ein Tipp aus der Community – kennst du einen kühlen Ort?
            Trag ihn in unter einer Minute ein.
          </p>
          <button
            onClick={() => setSubmitOpen(true)}
            className="btn-primary shrink-0 px-6"
          >
            <span aria-hidden="true">❄️</span> Spot eintragen
          </button>
        </div>
      </section>

      {demoMode && (
        <div className="mx-auto mt-3 max-w-5xl px-4">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <strong>Demo-Modus:</strong> Es werden Beispieldaten angezeigt. Hinterlege deine
            Supabase-Keys in <code className="rounded bg-amber-100 px-1">.env</code>, um echte Daten zu laden.
          </p>
        </div>
      )}

      <StatsBanner spots={spots} />

      <FilterBar filters={filters} onChange={setFilters} districts={districts} resultCount={filtered.length} />

      <div className="px-4 pb-8 pt-2">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-10 text-center">
            <p className="font-semibold text-red-700">Daten konnten nicht geladen werden</p>
            <p className="mt-1 text-sm text-red-500">{error}</p>
          </div>
        ) : (
          <SpotList
            spots={filtered}
            loading={loading}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        )}
      </div>

      <AddSpotFAB onClick={() => setSubmitOpen(true)} />
      <SubmitSpotSheet open={submitOpen} onClose={() => setSubmitOpen(false)} onSubmit={addSpot} />
    </main>
  )
}
