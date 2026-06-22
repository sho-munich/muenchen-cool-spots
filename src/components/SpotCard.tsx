import { Link } from 'react-router-dom'
import type { Spot } from '../types'
import { CATEGORY_META } from '../utils/constants'
import { timeAgo } from '../utils/format'

interface SpotCardProps {
  spot: Spot
}

export default function SpotCard({ spot }: SpotCardProps) {
  const meta = CATEGORY_META[spot.category] ?? { emoji: '📍', label: spot.category }

  return (
    <article className="flex flex-col rounded-2xl border border-sky-100 bg-white p-4 shadow-card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/spot/${spot.id}`} className="min-w-0">
          <h3 className="truncate text-base font-bold text-ink">{spot.name}</h3>
        </Link>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ice px-2.5 py-1 text-xs font-semibold text-slate-700">
          <span aria-hidden="true">{meta.emoji}</span>
          {meta.label}
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
        <PinIcon />
        <span className="truncate">{spot.district ? `${spot.district} · ` : ''}{spot.address}</span>
      </p>

      {/* Feature-Zeile */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <Badge on={spot.has_ac} onLabel="❄️ Klimaanlage" offLabel="– keine AC" tone="confirm" />
        <Badge on={spot.wifi} onLabel="📶 WLAN" offLabel="– kein WLAN" tone="primary" />
        {spot.price_category && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
            {spot.price_category}
          </span>
        )}
        {spot.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-confirm">
            ✓ verifiziert
          </span>
        )}
      </div>

      {spot.highlights && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{spot.highlights}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 pt-1">
        {spot.google_maps_url ? (
          <a
            href={spot.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Google Bewertungen
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <span />
        )}
        <span className="text-xs text-slate-400">{timeAgo(spot.created_at)}</span>
      </div>
    </article>
  )
}

function Badge({
  on,
  onLabel,
  offLabel,
  tone,
}: {
  on: boolean
  onLabel: string
  offLabel: string
  tone: 'confirm' | 'primary'
}) {
  if (!on) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-400">
        {offLabel}
      </span>
    )
  }
  const cls =
    tone === 'confirm'
      ? 'bg-emerald-50 text-confirm'
      : 'bg-sky-50 text-primary'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ${cls}`}>
      {onLabel}
    </span>
  )
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
