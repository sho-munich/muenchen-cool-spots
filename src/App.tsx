import { Outlet, useOutletContext } from 'react-router-dom'
import Header from './components/Header'
import { useSpots } from './hooks/useSpots'
import type { NewSpot, Spot } from './types'

export interface AppContext {
  spots: Spot[]
  loading: boolean
  error: string | null
  demoMode: boolean
  addSpot: (spot: NewSpot) => Promise<Spot>
  refresh: () => Promise<void>
}

export default function App() {
  const { spots, loading, error, demoMode, addSpot, refresh } = useSpots()

  const ctx: AppContext = { spots, loading, error, demoMode, addSpot, refresh }

  return (
    <div className="min-h-[100dvh]">
      <Header />
      <Outlet context={ctx} />
      <footer className="px-4 pb-28 pt-8 text-center text-xs text-slate-400">
        München Cool Spots · Community-Projekt · ❄️ bleib kühl
      </footer>
    </div>
  )
}

export function useAppContext() {
  return useOutletContext<AppContext>()
}
