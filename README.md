# München Cool Spots ❄️

Community-Tool, das Cafés, Restaurants & Co-Working-Spaces **mit Klimaanlage** in München
sammelt und anzeigt. Mobile-first, kein Login, alle dürfen lesen & schreiben.

**Stack:** React + Vite + TypeScript · Tailwind CSS · Supabase (Postgres) · Vercel — alles im kostenlosen Tier.

---

## 🚀 Schnellstart (lokal)

```bash
npm install
cp .env.example .env     # Supabase-Keys eintragen (optional – s.u.)
npm run dev
```

> **Demo-Modus:** Ohne Supabase-Keys läuft die App sofort mit Beispieldaten.
> Einreichen funktioniert dann lokal (nicht persistent). Sobald `.env` gesetzt
> ist, werden echte Daten aus Supabase geladen.

---

## 🗄️ Supabase einrichten

1. Auf [supabase.com](https://supabase.com) ein kostenloses Projekt anlegen.
2. Im **SQL Editor** den Inhalt von [`supabase/schema.sql`](supabase/schema.sql) ausführen.
   Das legt die Tabelle `spots` an, aktiviert **Row Level Security** und setzt die Policies:
   - **SELECT** → für alle (public lesen)
   - **INSERT** → für alle (public einreichen, kein Auth)
   - **UPDATE/DELETE** → keine Policy ⇒ für anon automatisch gesperrt
3. Unter **Project Settings → API** die Werte kopieren und in `.env` eintragen:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-public-key
```

Der **anon key** ist öffentlich und darf im Frontend liegen – durch RLS ist nur
Lesen & Einreichen erlaubt.

---

## ☁️ Deployment auf Vercel

1. Repo zu GitHub pushen.
2. Auf [vercel.com](https://vercel.com) → **New Project** → Repo importieren.
3. Framework wird als **Vite** erkannt. Unter **Environment Variables** dieselben
   beiden Keys (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) hinterlegen.
4. **Deploy** – fertig.

Die [`vercel.json`](vercel.json) sorgt für:
- SPA-Routing (alle Pfade → `index.html`)
- dynamische **Open-Graph-Previews** pro Spot via [`api/og.js`](api/og.js):
  `/spot/:id` wird serverseitig mit Titel & Highlights des Spots gerendert,
  damit Links in WhatsApp/Slack/X schöne Vorschauen zeigen.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Liste + Karten** | Responsive Grid (1 Spalte mobil / 2–3 Desktop), Kategorie-Badges mit Emoji, AC/WLAN/Preis, Highlights (2 Zeilen), „Google Bewertungen →", Relativdatum |
| **Filter** | Sticky Chips für Kategorie; Bottom Sheet (mobile-friendly) für WLAN, Preis & Stadtviertel (dynamisch aus DB) |
| **Spot einreichen** | FAB unten rechts → Bottom-Sheet-Formular mit Validierung, Toggles, Zeichenzähler; sofort sichtbar, Erfolgs-State |
| **Teilen** | Web Share API (mobil) / Clipboard-Fallback (Desktop); eigene URL `/spot/:id` mit OG-Tags |
| **Statistik-Banner** | Anzahl Spots, letzte Aktualisierung, Zähler pro Kategorie |

### Design
- Farben: Sky Blue `#0EA5E9`, Akzent `#38BDF8`, BG `#F0F9FF`, Text `#0F172A`, AC-Grün `#10B981`
- Inter-Font, Touch-Targets ≥ 44px, keine Hover-only-Interaktionen, Safe-Area-Insets

---

## 📁 Projektstruktur

```
src/
  components/   Header, StatsBanner, FilterBar, BottomSheet,
                SpotCard, SpotList, AddSpotFAB, SubmitSpotSheet, ShareButton
  pages/        HomePage, SpotDetailPage
  hooks/        useSpots (Supabase + Demo-Fallback)
  lib/          supabase.ts, demoData.ts
  utils/        constants.ts, format.ts (timeAgo, URL-Validierung)
  types.ts
api/og.js       Vercel OG-Function für Social Previews
supabase/schema.sql
```

## Scripts
- `npm run dev` – Dev-Server
- `npm run build` – Production-Build (`dist/`)
- `npm run preview` – Build lokal testen
- `npm run lint` – TypeScript-Check
