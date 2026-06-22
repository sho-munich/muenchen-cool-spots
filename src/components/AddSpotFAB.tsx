interface AddSpotFABProps {
  onClick: () => void
}

export default function AddSpotFAB({ onClick }: AddSpotFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Spot hinzufügen"
      className="fixed right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-4 font-bold text-white shadow-fab transition-transform hover:bg-sky-600 active:scale-95"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <span className="text-lg" aria-hidden="true">❄️</span>
      <span>Spot hinzufügen</span>
    </button>
  )
}
