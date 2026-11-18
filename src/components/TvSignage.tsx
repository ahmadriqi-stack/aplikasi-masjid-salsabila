import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Expand,
  Minimize,
  X,
} from 'lucide-react'
import type { Theme } from '../theme'
import type { ScheduleDay } from '../data/prayer'
import { findNextPrayer, formatCountdown } from '../hooks/usePrayerSchedule'
import { getHijriInfo } from '../hooks/useHijri'
import { HADITHS } from '../data/hadith'

interface Props {
  theme: Theme
  schedule: ScheduleDay
  city: string
  now: Date
  onExit: () => void
  onToggleTheme: () => void
}

/** Panel berputar di bawah — Waktu Sholat selalu tampil di atas, tidak ikut berganti */
type PanelKey = 'jadwal' | 'hadis'

const PANELS: { key: PanelKey; label: string }[] = [
  { key: 'jadwal', label: 'Jadwal' },
  { key: 'hadis', label: 'Hadis' },
]

const ROTATE_MS = 14_000

function isTvUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Android TV|SmartTV|GoogleTV|AmazonTV|HbbTV|TECNO|Tizen|Web0S|AppleTV/i.test(ua)
}

export function initialTvMode(): boolean {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  if (q.get('tv') === '1' || q.get('mode') === 'tv') return true
  if (q.get('tv') === '0' || q.get('mode') === 'normal') return false
  return isTvUserAgent()
}

function panelFromHash(): PanelKey | null {
  if (typeof window === 'undefined') return null
  const h = window.location.hash.replace('#', '').toLowerCase()
  if (!h || h === 'waktu') return null // waktu selalu tampil, bukan panel berputar
  const hit = PANELS.find((p) => p.key === h)
  return hit ? hit.key : null
}

/** Latar jernih + animasi bergerak untuk Mode TV / signage */
function TvBackdrop({ theme }: { theme: Theme }) {
  const t = theme.raw
  // Always clear / luminous — not flat, not muddy. Dark themes stay deep but airy.
  const base = theme.isDark
    ? `linear-gradient(155deg, #8ae2fd 0%, #5ddef2 32%, #85f6fe 58%, #6ed2f0 78%, #63d3ef 100%)`
    : `linear-gradient(155deg, #ffffff 0%, ${t.bg} 28%, #e8f4f2 55%, #ffffff 78%, ${t.bg} 100%)`

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: base }} />

      {/* Moving aurora washes — always in motion */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[70vw] w-[70vw] animate-aurora rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${t.accent}88 0%, ${t.accent}28 45%, transparent 70%)`,
          opacity: theme.isDark ? 0.85 : 0.65,
          animationDuration: '22s',
        }}
      />
      <div
        className="absolute -right-1/4 top-1/4 h-[60vw] w-[60vw] animate-aurora rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${t.gold}66 0%, ${t.goldDeep}22 40%, transparent 70%)`,
          opacity: theme.isDark ? 0.65 : 0.5,
          animationDuration: '28s',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute bottom-[-20%] left-1/4 h-[55vw] w-[55vw] animate-aurora rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, #7dd3fc55 0%, ${t.primary}40 40%, transparent 70%)`,
          opacity: theme.isDark ? 0.6 : 0.45,
          animationDuration: '32s',
          animationDelay: '-12s',
        }}
      />
      {/* Soft white / cyan “jernih” lift */}
      <div
        className="absolute inset-0 animate-aurora"
        style={{
          background: theme.isDark
            ? 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(125,211,252,0.12) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 80% 60% at 50% 35%, rgba(255,255,255,0.75) 0%, transparent 60%)',
          animationDuration: '24s',
          animationDelay: '-3s',
        }}
      />

      {/* Soft light beam that slowly drifts */}
      <div
        className="absolute inset-x-0 top-0 h-full opacity-55"
        style={{
          background: theme.isDark
            ? 'linear-gradient(105deg, transparent 28%, rgba(186,230,253,0.14) 44%, rgba(253,224,71,0.10) 50%, transparent 68%)'
            : 'linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.7) 44%, rgba(253,230,138,0.3) 52%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'tvSweep 16s ease-in-out infinite',
        }}
      />

      {/* Drifting arabesque lattice */}
      <div
        className="absolute inset-[-20%] animate-drift opacity-40"
        style={{
          backgroundImage: theme.isDark
            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%2393c5fd' stroke-opacity='0.28' stroke-width='1'%3E%3Cpath d='M50 0v100M0 50h100M0 0l100 100M100 0L0 100'/%3E%3Ccircle cx='50' cy='50' r='18'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3Cpath d='M50 10 L90 50 L50 90 L10 50 Z'/%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%230f766e' stroke-opacity='0.20' stroke-width='1'%3E%3Cpath d='M50 0v100M0 50h100M0 0l100 100M100 0L0 100'/%3E%3Ccircle cx='50' cy='50' r='18'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3Cpath d='M50 10 L90 50 L50 90 L10 50 Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          animationDuration: '40s',
        }}
      />

      {/* Floating orbs — continuous float */}
      {[
        { size: 22, top: '12%', left: '8%', delay: '0s', color: t.accent, opacity: 0.45 },
        { size: 12, top: '22%', left: '78%', delay: '1.2s', color: t.gold, opacity: 0.5 },
        { size: 32, top: '58%', left: '12%', delay: '0.6s', color: t.primary, opacity: 0.35 },
        { size: 16, top: '70%', left: '82%', delay: '2s', color: t.accent, opacity: 0.4 },
        { size: 10, top: '40%', left: '48%', delay: '1.6s', color: t.gold, opacity: 0.4 },
        { size: 18, top: '18%', left: '42%', delay: '2.4s', color: '#38bdf8', opacity: 0.4 },
        { size: 14, top: '80%', left: '38%', delay: '0.3s', color: t.goldDeep, opacity: 0.38 },
        { size: 9, top: '55%', left: '88%', delay: '1.8s', color: '#7dd3fc', opacity: 0.42 },
      ].map((o, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-floaty"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            background: o.color,
            opacity: o.opacity,
            filter: `blur(${o.size > 16 ? 16 : 6}px)`,
            animationDelay: o.delay,
            animationDuration: `${7 + (i % 4) * 1.5}s`,
            boxShadow: `0 0 ${o.size * 2.5}px ${o.color}`,
          }}
        />
      ))}

      {/* Gentle vignette for readability of panels */}
      <div
        className="absolute inset-0"
        style={{
          background: theme.isDark
            ? 'radial-gradient(ellipse at center, transparent 42%, rgba(8,14,28,0.35) 100%)'
            : 'radial-gradient(ellipse at center, transparent 48%, rgba(245,242,234,0.4) 100%)',
        }}
      />
    </div>
  )
}

export function TvSignage({
  theme,
  schedule,
  city,
  now,
  onExit,
  onToggleTheme,
}: Props) {
  const t = theme.raw
  const [panel, setPanel] = useState<PanelKey>(() => panelFromHash() ?? 'jadwal')
  const [hadisIdx, setHadisIdx] = useState(0)
  const [full, setFull] = useState(false)

  const hijri = getHijriInfo(now)
  const { next, secondsUntilNext } = findNextPrayer(schedule.times, now)
  const clock = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // Bump to restart the auto-rotate interval after manual interaction
  const [rotateEpoch, setRotateEpoch] = useState(0)
  const bumpRotate = useCallback(() => setRotateEpoch((n) => n + 1), [])

  const go = useCallback((dir: 1 | -1) => {
    setPanel((cur) => {
      const i = PANELS.findIndex((p) => p.key === cur)
      const n = (i + dir + PANELS.length) % PANELS.length
      return PANELS[n].key
    })
  }, [])

  const goAndHold = useCallback(
    (dir: 1 | -1) => {
      go(dir)
      bumpRotate()
    },
    [go, bumpRotate],
  )

  const selectPanel = useCallback(
    (key: PanelKey) => {
      setPanel(key)
      bumpRotate()
    },
    [bumpRotate],
  )

  const toggleFullscreen = useCallback(() => {
    const el = document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {})
      setFull(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setFull(false)
    }
  }, [])

  useEffect(() => {
    const onFs = () => setFull(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // Auto-rotate panels; restart clock after manual nav so user isn't yanked away
  useEffect(() => {
    const id = window.setInterval(() => go(1), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [go, panel, rotateEpoch])

  // Cycle hadis faster when on that panel
  useEffect(() => {
    if (panel !== 'hadis') return
    const id = window.setInterval(() => {
      setHadisIdx((i) => (i + 1) % HADITHS.length)
    }, 8000)
    return () => window.clearInterval(id)
  }, [panel])

  // Honor #hadis / #jadwal etc. when hash changes while open
  useEffect(() => {
    const onHash = () => {
      const h = panelFromHash()
      if (h) selectPanel(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [selectPanel])

  // Keep screen awake for signage / Android TV (best-effort)
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null
    let cancelled = false

    const requestLock = async () => {
      try {
        const wl = (navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock
        if (!wl?.request) return
        lock = await wl.request('screen')
      } catch {
        /* Wake Lock may be denied on some TVs — ignore */
      }
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible' && !cancelled) void requestLock()
    }

    void requestLock()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release?.().catch(() => {})
    }
  }, [])

  // Remote / keyboard navigation (Android TV D-pad: ← → = arrows, OK = Enter)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        goAndHold(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goAndHold(-1)
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
        bumpRotate()
      } else if (e.key === 'Enter') {
        // OK on remote: activate focused control, or toggle fullscreen when body is focused
        const el = document.activeElement
        const interactive =
          el instanceof HTMLElement && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.isContentEditable)
        if (!interactive) {
          e.preventDefault()
          toggleFullscreen()
          bumpRotate()
        }
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
        else onExit()
      } else if (e.key === 't' || e.key === 'T') {
        onToggleTheme()
      } else if (/^[1-2]$/.test(e.key)) {
        const idx = Number(e.key) - 1
        if (PANELS[idx]) selectPanel(PANELS[idx].key)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bumpRotate, goAndHold, onExit, onToggleTheme, selectPanel, toggleFullscreen])

  const hadis = HADITHS[hadisIdx % HADITHS.length]

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ color: t.ink }}
    >
      <TvBackdrop theme={theme} />

      {/* Header — always visible, large for 10-foot UI */}
      <header
        className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-6 py-4 md:px-10 md:py-5"
        style={{
          borderBottom: `1px solid ${theme.isDark ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.06)'}`,
          background: theme.isDark
            ? 'rgba(12,24,48,0.72)'
            : 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10 md:h-16 md:w-16">
            <img src="/logo.png" alt="Logo Masjid Salsabila" className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] md:text-xs" style={{ color: t.inkSoft }}>
              Masjid
            </p>
            <p className="font-display text-2xl font-semibold leading-none md:text-3xl">Salsabila</p>
          </div>
        </div>

        <div className="hidden text-center md:block">
          <p className="text-xs md:text-sm" style={{ color: t.inkSoft }}>
            {hijri.gregorian}
          </p>
          <p className="mt-0.5 text-xs font-semibold md:text-sm" style={{ color: t.accent }}>
            {hijri.hijri}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="rounded-full px-4 py-2 text-sm font-semibold transition md:text-base"
            style={{ background: 'var(--chip-bg)', color: t.inkSoft, boxShadow: 'inset 0 0 0 1px var(--border)' }}
            title="Ganti tema (T)"
          >
            {theme.name}
          </button>
          <button
            onClick={toggleFullscreen}
            className="grid h-11 w-11 place-items-center rounded-full md:h-12 md:w-12"
            style={{ background: 'var(--chip-bg)', color: t.ink, boxShadow: 'inset 0 0 0 1px var(--border)' }}
            aria-label="Layar penuh"
            title="Layar penuh (F)"
          >
            {full ? <Minimize className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
          </button>
          <button
            onClick={onExit}
            className="grid h-11 w-11 place-items-center rounded-full md:h-12 md:w-12"
            style={{ background: t.accent, color: t.onAccent }}
            aria-label="Keluar Mode TV"
            title="Keluar (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Panel nav — D-pad friendly, hanya untuk panel berputar di bawah */}
      <nav className="relative z-10 flex shrink-0 items-center justify-center gap-1.5 px-4 py-2.5 md:gap-2 md:py-3">
        <button
          onClick={() => goAndHold(-1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full md:h-11 md:w-11"
          style={{ background: 'var(--chip-bg)', color: t.inkSoft, boxShadow: 'inset 0 0 0 1px var(--border)' }}
          aria-label="Panel sebelumnya"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          {PANELS.map((p, i) => {
            const active = p.key === panel
            return (
              <button
                key={p.key}
                onClick={() => selectPanel(p.key)}
                className="rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition md:px-5 md:py-2.5 md:text-sm"
                style={{
                  background: active ? t.accent : 'var(--chip-bg)',
                  color: active ? t.onAccent : t.inkSoft,
                  boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--border)',
                }}
              >
                <span className="opacity-60 mr-1">{i + 1}</span>
                {p.label}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => goAndHold(1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full md:h-11 md:w-11"
          style={{ background: 'var(--chip-bg)', color: t.inkSoft, boxShadow: 'inset 0 0 0 1px var(--border)' }}
          aria-label="Panel berikutnya"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>

      {/* Main — Waktu Sholat selalu tampil di atas (tidak bergeser) */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 px-4 py-3 md:gap-6 md:px-10 md:py-5">
        <div className="shrink-0">
          <WaktuPanel
            t={t}
            isDark={theme.isDark}
            clock={clock}
            next={next}
            seconds={secondsUntilNext}
            hijri={hijri.hijri}
            gregorian={hijri.gregorian}
            city={city}
            times={schedule.times}
          />
        </div>

        {/* Panel berputar di bawah — jadwal / hadis */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={panel}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              {panel === 'jadwal' && (
                <JadwalPanel
                  t={t}
                  isDark={theme.isDark}
                  times={schedule.times}
                  now={now}
                  hijri={schedule.hijri}
                  date={schedule.date}
                  compact
                />
              )}
              {panel === 'hadis' && (
                <HadisPanel
                  t={t}
                  isDark={theme.isDark}
                  hadis={hadis}
                  hadisIdx={hadisIdx}
                  total={HADITHS.length}
                  onNext={() => setHadisIdx((i) => (i + 1) % HADITHS.length)}
                  compact
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer bar — next prayer always on screen */}
      <footer
        className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-10 md:py-4"
        style={{
          borderTop: `1px solid ${theme.isDark ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.06)'}`,
          background: theme.isDark ? 'rgba(12,24,48,0.78)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(18px)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl text-white"
            style={{ background: t.accent }}
          >
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: t.inkSoft }}>
              Menjelang {next.name}
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums lining-nums leading-tight md:text-3xl">
              {next.time}
              <span className="ml-3 text-base font-bold tabular-nums lining-nums md:text-xl" style={{ color: t.accent }}>
                {formatCountdown(secondsUntilNext)}
              </span>
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-4 text-right text-xs md:flex" style={{ color: t.inkSoft }}>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {hijri.gregorian} · {hijri.hijri}
          </span>
          <span>← → panel · F layar penuh · Esc keluar</span>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-xs" style={{ color: t.inkSoft }}>
            {hijri.hijri}
          </span>
        </div>
      </footer>
    </div>
  )
}

/* ---------- panels ---------- */

type Raw = Theme['raw']

/** Translucent glass so the animated jernih backdrop always shows through */
function glassSurface(t: Raw, isDark: boolean, extraShadow = '0 25px 50px -20px rgba(0,0,0,0.18)') {
  const rgb = isDark ? '8,18,36' : '255,255,255'
  const alpha = isDark ? 0.55 : 0.72
  const edge = isDark ? `${t.accent}44` : 'rgba(15,23,42,0.06)'
  return {
    background: `rgba(${rgb}, ${alpha})`,
    backdropFilter: 'blur(20px) saturate(1.15)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.15)',
    boxShadow: `${extraShadow}, inset 0 0 0 1px ${edge}`,
  } as CSSProperties
}

function WaktuPanel({
  t,
  isDark,
  clock,
  next,
  seconds,
  hijri,
  gregorian,
  city,
  times,
}: {
  t: Raw
  isDark: boolean
  clock: string
  next: { name: string; time: string }
  seconds: number
  hijri: string
  gregorian: string
  city: string
  times: { key: string; name: string; time: string; arabic: string }[]
}) {
  return (
    <div className="grid gap-3 md:gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-center">
      <div
        className="rounded-[1.5rem] p-5 md:p-6 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${t.heroFrom}CC 0%, ${t.heroVia}D9 50%, ${t.heroTo}E6 100%)`,
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px) saturate(1.2)',
        }}
      >
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 md:text-xs">Waktu sekarang · {city}</p>
        <p className="mt-1 font-display text-5xl font-semibold tabular-nums lining-nums tracking-tight md:text-6xl lg:text-7xl">
          {clock}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-xs text-white/70 md:text-sm">{gregorian}</p>
          <p className="text-sm font-bold text-white md:text-base" style={{ color: '#fde68a' }}>
            {hijri}
          </p>
        </div>
      </div>

      <div className="space-y-2.5 md:space-y-3">
        <div className="rounded-2xl p-4 md:p-5" style={glassSurface(t, isDark, '0 12px 30px -12px rgba(0,0,0,0.2)')}>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] md:text-xs" style={{ color: t.inkSoft }}>
                Menjelang {next.name}
              </p>
              <p className="font-display text-3xl font-semibold tabular-nums lining-nums md:text-4xl">
                {next.time}
              </p>
            </div>
            <p className="text-2xl font-bold tabular-nums lining-nums md:text-3xl" style={{ color: t.accent }}>
              {formatCountdown(seconds)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-3 md:p-4" style={glassSurface(t, isDark, 'none')}>
          <div className="grid grid-cols-5 gap-1.5 md:gap-2">
            {times
              .filter((p) => p.key !== 'Sunrise')
              .map((p) => (
                <div key={p.key} className="rounded-xl px-1.5 py-2 text-center md:px-2 md:py-2.5" style={{ background: 'var(--chip-bg)' }}>
                  <p className="text-[9px] uppercase tracking-wider md:text-[10px]" style={{ color: t.inkSoft }}>
                    {p.name}
                  </p>
                  <p className="font-display text-base font-semibold tabular-nums lining-nums md:text-xl">
                    {p.time}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function JadwalPanel({
  t,
  isDark,
  times,
  now,
  hijri,
  date,
  compact = false,
}: {
  t: Raw
  isDark: boolean
  times: { key: string; name: string; time: string; arabic: string }[]
  now: Date
  hijri: string
  date: string
  compact?: boolean
}) {
  const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  const withSec = times.map((p) => {
    const [h, m] = p.time.split(':').map(Number)
    return { ...p, sec: h * 3600 + m * 60 }
  })
  let currentKey = withSec[0].key
  for (const p of withSec) if (nowSec >= p.sec) currentKey = p.key

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3 md:mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] md:text-xs" style={{ color: t.accent }}>
            Jadwal Sholat Hari Ini
          </p>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{date}</h2>
          <p className="text-sm md:text-base" style={{ color: t.inkSoft }}>
            {hijri}
          </p>
        </div>
      </div>
      <div className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 ${compact ? 'md:gap-2.5' : 'md:gap-3'}`}>
        {withSec.map((p) => {
          const isCurrent = p.key === currentKey
          return (
            <div
              key={p.key}
              className={`flex items-center justify-between rounded-2xl ${compact ? 'px-4 py-3 md:px-5 md:py-4' : 'rounded-3xl px-6 py-5 md:px-8 md:py-7'}`}
              style={{
                ...(isCurrent
                  ? {
                      background: `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})`,
                      color: '#fff',
                      boxShadow: '0 12px 28px -12px rgba(0,0,0,0.3)',
                    }
                  : glassSurface(t, isDark, 'none')),
                color: isCurrent ? '#fff' : t.ink,
              }}
            >
              <div>
                <p className="text-xs uppercase tracking-widest md:text-sm" style={{ opacity: 0.75 }}>
                  {p.name}
                </p>
                <p className="font-arabic text-lg md:text-xl">{p.arabic}</p>
              </div>
              <p className="font-display text-2xl font-semibold tabular-nums lining-nums md:text-3xl">
                {p.time}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HadisPanel({
  t,
  isDark,
  hadis,
  hadisIdx,
  total,
  onNext,
  compact = false,
}: {
  t: Raw
  isDark: boolean
  hadis: (typeof HADITHS)[number]
  hadisIdx: number
  total: number
  onNext: () => void
  compact?: boolean
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] md:text-xs" style={{ color: t.accent }}>
        Kumpulan Hadis · {hadis.theme}
      </p>
      <div
        className={`relative mt-3 overflow-hidden rounded-2xl ${compact ? 'px-5 py-5 md:px-8 md:py-6' : 'mt-6 rounded-[2rem] px-8 py-10 md:px-14 md:py-14'}`}
        style={glassSurface(t, isDark)}
      >
        {/* soft moving sheen on hadis card */}
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background: `linear-gradient(120deg, transparent 30%, ${t.accent}28 48%, ${t.gold}20 55%, transparent 70%)`,
            backgroundSize: '220% 100%',
            animation: 'tvSweep 10s ease-in-out infinite',
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={hadisIdx}
            initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p
              className="mx-auto max-w-3xl text-xl leading-[1.9] md:text-2xl md:leading-[1.8]"
              dir="rtl"
              lang="ar"
              style={{ fontFamily: "'Amiri Quran', 'Traditional Arabic', serif", color: t.ink }}
            >
              {hadis.arabic}
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: t.inkSoft }}>
              “{hadis.translation}”
            </p>
            <p className="mt-2 text-sm font-semibold md:text-base" style={{ color: t.accent }}>
              {hadis.narrator} · {hadis.source}
            </p>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={onNext}
          className="relative mt-3 rounded-full px-6 py-2 text-sm font-bold md:text-base"
          style={{ background: t.accent, color: t.onAccent }}
        >
          Hadis berikutnya
        </button>
        <p className="relative mt-2 text-xs" style={{ color: t.inkSoft, opacity: 0.7 }}>
          {hadisIdx + 1} / {total}
        </p>
      </div>
    </div>
  )
}
