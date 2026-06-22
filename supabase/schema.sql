-- ============================================================
--  München Cool Spots – Supabase Schema
--  Im Supabase Dashboard unter "SQL Editor" einfügen & ausführen.
-- ============================================================

create table if not exists spots (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category in ('Café', 'Restaurant', 'Co-Working', 'Bar', 'Sonstiges')),
  address text not null,
  district text,
  has_ac boolean default true,
  wifi boolean default false,
  price_category text check (price_category in ('€', '€€', '€€€')),
  highlights text,
  google_maps_url text,
  submitted_by text default 'Anonym',
  created_at timestamp with time zone default now(),
  verified boolean default false
);

create index if not exists spots_created_at_idx on spots (created_at desc);
create index if not exists spots_category_idx on spots (category);

-- ------------------------------------------------------------
--  Row Level Security
-- ------------------------------------------------------------
alter table spots enable row level security;

-- SELECT: für alle (public lesen)
drop policy if exists "Public can read spots" on spots;
create policy "Public can read spots"
  on spots for select
  to anon, authenticated
  using (true);

-- INSERT: für alle (public einreichen, kein Auth nötig)
drop policy if exists "Public can insert spots" on spots;
create policy "Public can insert spots"
  on spots for insert
  to anon, authenticated
  with check (true);

-- UPDATE / DELETE: bewusst KEINE Policy ->
-- bei aktiviertem RLS ohne passende Policy sind beide Operationen
-- für anon/authenticated automatisch verboten.

-- ------------------------------------------------------------
--  Optionale Beispiel-Daten zum schnellen Testen
-- ------------------------------------------------------------
insert into spots (name, category, address, district, has_ac, wifi, price_category, highlights, google_maps_url, submitted_by, verified)
values
  ('Café Frischluft', 'Café', 'Sendlinger Str. 12, 80331 München', 'Altstadt-Lehel', true, true, '€€', 'Eiskalt im Sommer, ruhige Atmosphäre, exzellenter Flat White.', 'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9+Frischluft+M%C3%BCnchen', 'Lena', true),
  ('Polar Works', 'Co-Working', 'Landwehrstr. 30, 80336 München', 'Ludwigsvorstadt-Isarvorstadt', true, true, '€€', 'Starke Klima, schnelles WLAN, Steckdosen an jedem Platz.', 'https://www.google.com/maps/search/?api=1&query=Polar+Works+M%C3%BCnchen', 'Anonym', false),
  ('Trattoria Tramontana', 'Restaurant', 'Türkenstr. 80, 80799 München', 'Maxvorstadt', true, false, '€€€', 'Angenehm kühl auch bei 35°C draußen. Top Pasta.', 'https://www.google.com/maps/search/?api=1&query=Trattoria+Tramontana+M%C3%BCnchen', 'Max', false)
on conflict do nothing;
