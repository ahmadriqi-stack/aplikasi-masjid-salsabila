import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, MonitorPlay } from 'lucide-react'
import type { Theme } from '../theme'
import { ThemeSwitcher } from './ThemeSwitcher'
import type { ThemeKey } from '../theme'

interface Props {
  theme: Theme
  onThemeChange: (key: ThemeKey) => void
  onEnterTv?: () => void
}

const NAV = [
  { href: '#jadwal', label: 'Jadwal' },
  { href: '#kalender', label: 'Kalender' },
  { href: '#pengumuman', label: 'Pengumuman' },
  { href: '#hadis', label: 'Hadis' },
  { href: '#agenda', label: 'Agenda' },
]

export function Navbar({ theme, onThemeChange, onEnterTv }: Props) {
  const t = theme.raw
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
        <a
          href="#top"
          className={`flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 transition-all duration-300 ${
            scrolled ? 'glass' : 'bg-transparent'
          }`}
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5"
          >
            <img src="/logo.png" alt="Logo Masjid Salsabila" className="h-full w-full object-cover" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold" style={{ color: t.ink }}>
              Salsabila
            </span>
            <span className="block text-[10px] uppercase tracking-[0.25em]" style={{ color: t.inkSoft }}>
              Masjid
            </span>
          </span>
        </a>

        <nav className={`hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex ${scrolled ? 'glass' : ''}`}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium transition"
              style={{ color: t.inkSoft }}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onEnterTv && (
            <button
              onClick={onEnterTv}
              className="btn-ghost hidden lg:inline-flex"
              style={{ background: t.surface, color: t.ink, boxShadow: 'inset 0 0 0 1px var(--border)' }}
              title="Mode TV / Signage"
            >
              <MonitorPlay className="h-4 w-4" style={{ color: t.accent }} />
              Mode TV
            </button>
          )}
          <ThemeSwitcher theme={theme} onChange={onThemeChange} />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full md:hidden"
            style={{
              background: t.surface,
              color: t.ink,
              boxShadow: `inset 0 0 0 1px var(--border)`,
            }}
            aria-label="Buka menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 rounded-3xl p-3 shadow-xl backdrop-blur md:hidden"
          style={{ background: t.surface, boxShadow: `0 20px 40px rgba(0,0,0,0.2), inset 0 0 0 1px var(--border)` }}
        >
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium transition"
              style={{ color: t.ink }}
            >
              {n.label}
            </a>
          ))}
        </motion.nav>
      )}
    </motion.header>
  )
}
