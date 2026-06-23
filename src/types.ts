export type Category = 'Café' | 'Restaurant' | 'Co-Working' | 'Bar' | 'Sonstiges'
export type PriceCategory = '€' | '€€' | '€€€'

export interface Spot {
  id: string
  name: string
  category: Category
  address: string
  district: string | null
  has_ac: boolean
  wifi: boolean
  price_category: PriceCategory | null
  highlights: string | null
  google_maps_url: string | null
  submitted_by: string
  created_at: string
  verified: boolean
}

/** Felder, die beim Einreichen vom Formular kommen. */
export type NewSpot = Omit<Spot, 'id' | 'created_at' | 'verified'>

export interface Filters {
  category: Category | 'Alle'
  wifiOnly: boolean
  price: PriceCategory | 'Alle'
  /** Freitext-Standortsuche: matcht auf district + address (Stadtviertel oder PLZ). */
  location: string
}
