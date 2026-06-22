import type { Category, PriceCategory } from '../types'

export const CATEGORIES: Category[] = ['Café', 'Restaurant', 'Co-Working', 'Bar', 'Sonstiges']

export const PRICES: PriceCategory[] = ['€', '€€', '€€€']

/** Emoji + Label pro Kategorie. */
export const CATEGORY_META: Record<Category, { emoji: string; label: string }> = {
  Café: { emoji: '☕', label: 'Café' },
  Restaurant: { emoji: '🍽', label: 'Restaurant' },
  'Co-Working': { emoji: '💻', label: 'Co-Working' },
  Bar: { emoji: '🍸', label: 'Bar' },
  Sonstiges: { emoji: '📍', label: 'Sonstiges' },
}

/** Kategorien, die in der Filterleiste auftauchen (laut Spec). */
export const FILTER_CATEGORIES: Category[] = ['Café', 'Restaurant', 'Co-Working', 'Bar']

export const MAX_HIGHLIGHTS = 300
