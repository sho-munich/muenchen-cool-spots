import { Link } from 'react-router-dom'
import ShareButton from './ShareButton'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-primary to-accent text-white shadow-md">
      <div
        className="mx-auto flex max-w-5xl items-center justify-between px-4"
        style={{ paddingTop: 'max(0.65rem, env(safe-area-inset-top))', paddingBottom: '0.65rem' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">❄️</span>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">
            München Cool&nbsp;Spots
          </span>
        </Link>
        <ShareButton
          variant="icon"
          title="München Cool Spots ❄️"
          text="Cafés & Co. mit Klimaanlage in München:"
        />
      </div>
    </header>
  )
}
