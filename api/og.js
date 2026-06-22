// Vercel Serverless Function.
// Liefert für /spot/:id das index.html mit dynamisch injizierten
// Open-Graph-Tags aus, damit Social-Media-Previews (WhatsApp, Slack,
// Twitter/X, iMessage …) Name & Highlights des Spots anzeigen.
// Der React-SPA bootet danach ganz normal weiter.

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req, res) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY

  // ID aus dem (durch den Rewrite erhaltenen) Pfad lesen.
  const match = (req.url || '').match(/\/spot\/([^/?#]+)/)
  const id = match ? decodeURIComponent(match[1]) : null

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const origin = `${proto}://${host}`

  // Basis-HTML (statisches index.html) holen.
  let html = ''
  try {
    const r = await fetch(`${origin}/index.html`)
    html = await r.text()
  } catch {
    // Fallback: ohne HTML können wir nichts injizieren -> redirect zur App.
    res.statusCode = 302
    res.setHeader('Location', '/')
    return res.end()
  }

  let title = 'München Cool Spots ❄️'
  let description = 'Wo bleibt’s kühl in München? Die Community-Karte für Orte mit Klimaanlage.'

  if (id && SUPABASE_URL && SUPABASE_KEY) {
    try {
      const apiRes = await fetch(
        `${SUPABASE_URL}/rest/v1/spots?id=eq.${encodeURIComponent(id)}&select=name,category,district,highlights`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        },
      )
      const rows = await apiRes.json()
      const spot = Array.isArray(rows) ? rows[0] : null
      if (spot) {
        title = `${spot.name} ❄️ – München Cool Spots`
        description =
          spot.highlights ||
          `${spot.category} mit Klimaanlage${spot.district ? ` in ${spot.district}` : ' in München'}.`
      }
    } catch {
      // bei Fehler einfach die Default-Tags verwenden
    }
  }

  const url = `${origin}/spot/${id ?? ''}`
  const tags = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
  `

  // Vorhandene <title>/og-Defaults entfernen und unsere Tags vor </head> setzen.
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+property="og:[^>]*>/gi, '')
    .replace('</head>', `${tags}</head>`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.statusCode = 200
  return res.end(html)
}
