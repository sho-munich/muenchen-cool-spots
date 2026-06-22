import { useState } from 'react'
import type { Category, NewSpot, PriceCategory } from '../types'
import { CATEGORIES, CATEGORY_META, MAX_HIGHLIGHTS, PRICES } from '../utils/constants'
import { isValidUrl } from '../utils/format'
import BottomSheet from './BottomSheet'

interface SubmitSpotSheetProps {
  open: boolean
  onClose: () => void
  onSubmit: (spot: NewSpot) => Promise<unknown>
}

interface FormState {
  name: string
  category: Category
  address: string
  district: string
  has_ac: boolean
  wifi: boolean
  price_category: PriceCategory | ''
  highlights: string
  google_maps_url: string
  submitted_by: string
}

const EMPTY: FormState = {
  name: '',
  category: 'Café',
  address: '',
  district: '',
  has_ac: true,
  wifi: false,
  price_category: '',
  highlights: '',
  google_maps_url: '',
  submitted_by: '',
}

export default function SubmitSpotSheet({ open, onClose, onSubmit }: SubmitSpotSheetProps) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const urlInvalid = !isValidUrl(form.google_maps_url)
  const canSubmit =
    form.name.trim() !== '' && form.address.trim() !== '' && !urlInvalid && !submitting

  function handleClose() {
    onClose()
    // kleinen Moment warten, damit der Reset nicht sichtbar ist
    window.setTimeout(() => {
      setForm(EMPTY)
      setSuccess(false)
      setError(null)
    }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const payload: NewSpot = {
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        district: form.district.trim() || null,
        has_ac: form.has_ac,
        wifi: form.wifi,
        price_category: form.price_category || null,
        highlights: form.highlights.trim() || null,
        google_maps_url: form.google_maps_url.trim() || null,
        submitted_by: form.submitted_by.trim() || 'Anonym',
      }
      await onSubmit(payload)
      setSuccess(true)
      setForm(EMPTY)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <BottomSheet open={open} onClose={handleClose} title="Spot einreichen">
      {success ? (
        <div className="flex flex-col items-center py-8 text-center">
          <span className="text-5xl" aria-hidden="true">🧊</span>
          <p className="mt-4 text-lg font-bold text-ink">Danke! Dein Spot ist online.</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Er ist sofort für alle sichtbar. Noch einen kühlen Ort auf Lager?
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setSuccess(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Noch einen
            </button>
            <button onClick={handleClose} className="btn-primary px-6">
              Fertig
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Name des Ortes" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="z.B. Café Frischluft"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Kategorie" required>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value as Category)}
                className={`${inputCls} appearance-none pr-10`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].emoji} {c}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
          </Field>

          <Field label="Adresse" required>
            <input
              type="text"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Straße Hausnr., PLZ München"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Stadtviertel" hint="optional">
            <input
              type="text"
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              placeholder="z.B. Maxvorstadt"
              className={inputCls}
            />
          </Field>

          {/* Toggles */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Toggle
              label="❄️ Klimaanlage vorhanden"
              checked={form.has_ac}
              onChange={(v) => set('has_ac', v)}
              required
            />
            <Toggle
              label="📶 WLAN vorhanden"
              checked={form.wifi}
              onChange={(v) => set('wifi', v)}
            />
          </div>

          <Field label="Preiskategorie" hint="optional">
            <div className="flex gap-2">
              {PRICES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => set('price_category', form.price_category === p ? '' : p)}
                  className={`chip flex-1 ${form.price_category === p ? 'chip-on' : 'chip-off'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Highlights" hint={`${form.highlights.length}/${MAX_HIGHLIGHTS}`}>
            <textarea
              value={form.highlights}
              maxLength={MAX_HIGHLIGHTS}
              onChange={(e) => set('highlights', e.target.value)}
              rows={3}
              placeholder="Sehr kalt! Ruhige Atmosphäre, guter Kaffee …"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Link zu Google Maps / Bewertungen" hint="optional">
            <input
              type="url"
              inputMode="url"
              value={form.google_maps_url}
              onChange={(e) => set('google_maps_url', e.target.value)}
              placeholder="https://maps.google.com/…"
              className={`${inputCls} ${urlInvalid ? 'border-red-400 focus:ring-red-300' : ''}`}
            />
            {urlInvalid && (
              <p className="mt-1 text-xs text-red-500">Bitte eine gültige http(s)-URL eingeben.</p>
            )}
          </Field>

          <Field label="Dein Name" hint="optional">
            <input
              type="text"
              value={form.submitted_by}
              onChange={(e) => set('submitted_by', e.target.value)}
              placeholder="Anonym"
              className={inputCls}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={!canSubmit} className="btn-primary w-full">
            {submitting ? 'Wird eingereicht …' : 'Spot einreichen 🧊'}
          </button>
        </form>
      )}
    </BottomSheet>
  )
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-accent/40'

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  required,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  required?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-medium transition-colors ${
        checked ? 'border-confirm bg-emerald-50 text-confirm' : 'border-slate-200 bg-white text-slate-500'
      }`}
    >
      <span>
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? 'bg-confirm' : 'bg-slate-300'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[1.125rem]' : 'left-0.5'}`}
        />
      </span>
    </button>
  )
}
