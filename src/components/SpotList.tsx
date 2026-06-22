import type { Spot } from '../types'
import SpotCard from './SpotCard'

interface SpotListProps {
  spots: Spot[]
  loading: boolean
  onResetFilters: () => void
}

export default function SpotList({ spots, loading, onResetFilters }: SpotListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl border border-sky-100 bg-white p-4">
            <div className="shimmer mb-3 h-5 w-2/3 rounded" />
            <div className="shimmer mb-2 h-3 w-1/2 rounded" />
            <div className="shimmer mt-4 h-6 w-3/4 rounded-full" />
            <div className="shimmer mt-4 h-3 w-full rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-white/60 px-6 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">🫠</span>
        <p className="mt-3 font-semibold text-ink">Keine Spots gefunden</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Mit diesen Filtern ist gerade nichts dabei. Setz die Filter zurück oder reiche selbst einen kühlen Ort ein.
        </p>
        <button onClick={onResetFilters} className="mt-4 text-sm font-semibold text-primary hover:underline">
          Filter zurücksetzen
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </div>
  )
}
