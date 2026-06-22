import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { DEMO_SPOTS } from '../lib/demoData'
import type { NewSpot, Spot } from '../types'

interface UseSpotsResult {
  spots: Spot[]
  loading: boolean
  error: string | null
  demoMode: boolean
  refresh: () => Promise<void>
  addSpot: (spot: NewSpot) => Promise<Spot>
}

export function useSpots(): UseSpotsResult {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpots = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured || !supabase) {
      // Demo-Modus: lokale Beispieldaten
      setSpots(DEMO_SPOTS)
      setLoading(false)
      return
    }

    const { data, error: dbError } = await supabase
      .from('spots')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      setError(dbError.message)
      setSpots([])
    } else {
      setSpots((data ?? []) as Spot[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchSpots()
  }, [fetchSpots])

  const addSpot = useCallback(async (newSpot: NewSpot): Promise<Spot> => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo-Modus: optimistisch lokal hinzufügen
      const optimistic: Spot = {
        ...newSpot,
        id: `demo-${crypto.randomUUID()}`,
        created_at: new Date().toISOString(),
        verified: false,
      }
      setSpots((prev) => [optimistic, ...prev])
      return optimistic
    }

    const { data, error: dbError } = await supabase
      .from('spots')
      .insert(newSpot)
      .select()
      .single()

    if (dbError) throw new Error(dbError.message)

    const created = data as Spot
    setSpots((prev) => [created, ...prev])
    return created
  }, [])

  return {
    spots,
    loading,
    error,
    demoMode: !isSupabaseConfigured,
    refresh: fetchSpots,
    addSpot,
  }
}
