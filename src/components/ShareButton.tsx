import { useState } from 'react'

interface ShareButtonProps {
  /** Zu teilende URL – default: aktuelle Seite. */
  url?: string
  title?: string
  text?: string
  /** kompakte Icon-Variante (Navbar) vs. voller Button. */
  variant?: 'icon' | 'full'
  className?: string
}

export default function ShareButton({
  url,
  title = 'München Cool Spots ❄️',
  text = 'Schau dir diesen kühlen Spot in München an:',
  variant = 'icon',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = url ?? window.location.href
    // Web Share API (mobil)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
        return
      } catch {
        // abgebrochen oder nicht erlaubt -> Fallback unten
      }
    }
    // Desktop-Fallback: in Zwischenablage kopieren
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Link kopieren:', shareUrl)
    }
  }

  if (variant === 'full') {
    return (
      <button onClick={handleShare} className={`btn-primary ${className}`}>
        <ShareIcon />
        {copied ? 'Link kopiert!' : 'Teilen'}
      </button>
    )
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Teilen"
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 active:bg-white/25 ${className}`}
    >
      <ShareIcon />
      {copied && (
        <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white shadow-lg">
          kopiert!
        </span>
      )}
    </button>
  )
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
