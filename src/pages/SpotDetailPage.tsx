import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppContext } from '../App'
import ShareButton from '../components/ShareButton'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Spot } from '../types'
import { CATEGORY_META } from '../utils/constants'
import { formatDate, timeAgo } from '../utils/format'

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { spots } = useAppContext()
  const [spot, setSpot] = useState<Spot | null>(() => spots.find((s) => s.id === id) ?? null)
  const [loading, setLoading] = useState(!spot)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const fromList = spots.find((s) => s.id === id)
    if (fromList) {
      setSpot(fromList)
      setLoading(false)
      return
    }
    // Direkter Aufruf der URL: einzeln nachladen (nur mit Supabase)
    if (!isSupabaseConfigured || !supabase || !id) {
      setNotFound(true)
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    supabase
      .from('spots')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!active) return
        if (data) setSpot(data as Spot)
        else setNotFound(true)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, spots])

  useEffect(() => {
    if (spot) {
      document.title = `${spot.name} – München Cool Spots ❄️`
      setMeta('description', spot.highlights ?? `${spot.category} mit Klimaanlage in München.`)
      setMeta('og:title', `${spot.name} ❄️`, true)
      setMeta('og:description', spot.highlights ?? `${spot.category} in ${spot.district ?? 'München'}`, true)
    }
    return () => {
      document.title = 'München Cool Spots ❄️'
    }
  }, [spot])

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="shimmer h-8 w-2/3 rounded" />
        <div className="shimmer mt-4 h-40 w-full rounded-2xl" />
      </main>
    )
  }

  if (notFound || !spot) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">🧊</span>
        <p className="mt-3 font-semibold text-ink">Spot nicht gefunden</p>
        <p className="mt-1 text-sm text-slate-500">Dieser Eintrag existiert nicht (mehr).</p>
        <Link to="/" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
          ← Zurück zur Übersicht
        </Link>
      </main>
    )
  }

  const meta = CATEGORY_META[spot.category] ?? { emoji: '📍', label: spot.category }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        ← Übersicht
      </Link>

      <article className="mt-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-ink">{spot.name}</h1>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ice px-3 py-1.5 text-sm font-semibold text-slate-700">
            <span aria-hidden="true">{meta.emoji}</span>
            {meta.label}
          </span>
        </div>

        <p className="mt-2 text-slate-500">
          {spot.district ? `${spot.district} · ` : ''}
          {spot.address}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Pill on={spot.has_ac} onLabel="❄️ Klimaanlage" offLabel="– keine AC" tone="confirm" />
          <Pill on={spot.wifi} onLabel="📶 WLAN" offLabel="– kein WLAN" tone="primary" />
          {spot.price_category && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
              {spot.price_category}
            </span>
          )}
          {spot.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-confirm">
              ✓ verifiziert
            </span>
          )}
        </div>

        {spot.highlights && (
          <p className="mt-5 rounded-xl bg-ice p-4 leading-relaxed text-slate-700">{spot.highlights}</p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {spot.google_maps_url && (
            <a
              href={spot.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1"
            >
              Google Bewertungen →
            </a>
          )}
          <ShareButton variant="full" className="flex-1" />
        </div>

        <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
          Eingereicht von <span className="font-medium text-slate-500">{spot.submitted_by}</span> ·{' '}
          {timeAgo(spot.created_at)} ({formatDate(spot.created_at)})
        </p>
      </article>
    </main>
  )
}

function Pill({
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
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-400">
        {offLabel}
      </span>
    )
  }
  const cls = tone === 'confirm' ? 'bg-emerald-50 text-confirm' : 'bg-sky-50 text-primary'
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 font-semibold ${cls}`}>
      {onLabel}
    </span>
  )
}

/** Setzt/aktualisiert ein <meta>-Tag im <head>. */
function setMeta(key: string, content: string, property = false) {
  const attr = property ? 'property' : 'name'
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
