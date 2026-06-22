/** Deutsche Relativzeit, z.B. "vor 2 Tagen", "gerade eben". */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMs = Date.now() - then
  const sec = Math.round(diffMs / 1000)
  const min = Math.round(sec / 60)
  const hour = Math.round(min / 60)
  const day = Math.round(hour / 24)
  const week = Math.round(day / 7)
  const month = Math.round(day / 30)
  const year = Math.round(day / 365)

  if (sec < 45) return 'gerade eben'
  if (min < 2) return 'vor 1 Minute'
  if (min < 60) return `vor ${min} Minuten`
  if (hour < 2) return 'vor 1 Stunde'
  if (hour < 24) return `vor ${hour} Stunden`
  if (day < 2) return 'gestern'
  if (day < 7) return `vor ${day} Tagen`
  if (week < 2) return 'vor 1 Woche'
  if (day < 30) return `vor ${week} Wochen`
  if (month < 2) return 'vor 1 Monat'
  if (day < 365) return `vor ${month} Monaten`
  if (year < 2) return 'vor 1 Jahr'
  return `vor ${year} Jahren`
}

/** Absolutes Datum für das Statistik-Banner, z.B. "22. Juni 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Google-Maps-Suchlink aus Name + Adresse (URL-encoded). */
export function googleMapsSearchUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name} ${address}`.trim())
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

/** Akzeptiert leere Strings (optional) oder gültige http(s)-URLs. */
export function isValidUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
