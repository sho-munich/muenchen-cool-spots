import { useMemo } from 'react'
import type { Spot } from '../types'
import { CATEGORY_META } from '../utils/constants'
import { formatDate } from '../utils/format'

interface StatsBannerProps {
  spots: Spot[]
}

export default function StatsBanner({ spots }: StatsBannerProps) {
  const { total, lastUpdated, byCategory } = useMemo(() => {
    const counts: Record<string, number> = {}
    let latest = ''
    for (const s of spots) {
      counts[s.category] = (counts[s.category] ?? 0) + 1
      if (!latest || s.created_at > latest) latest = s.created_at
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return { total: spots.length, lastUpdated: latest, byCategory: sorted }
  }, [spots])

  return (
    <section className="mx-auto mt-4 max-w-5xl px-4">
      <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 shadow-card backdrop-blur">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 className="text-base font-bold text-ink sm:text-lg">
            <span aria-hidden="true">❄️</span> {total} Cool {total === 1 ? 'Spot' : 'Spots'} in München
          </h2>
          {lastUpdated && (
            <span className="text-xs text-slate-500">
              zuletzt aktualisiert: {formatDate(lastUpdated)}
            </span>
          )}
        </div>

        {byCategory.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {byCategory.map(([cat, count]) => {
              const meta = CATEGORY_META[cat as keyof typeof CATEGORY_META]
              return (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ice px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <span aria-hidden="true">{meta?.emoji ?? '📍'}</span>
                  {cat}
                  <span className="rounded-full bg-primary/10 px-1.5 font-semibold text-primary">
                    {count}
                  </span>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
