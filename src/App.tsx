import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MonitorPlay } from 'lucide-react'
import { Navbar } from './components/Navbar'
import { PrayerHero } from './components/PrayerHero'
import { PrayerSchedule } from './components/PrayerSchedule'
import { HijriCalendar } from './components/HijriCalendar'
import { Announcements } from './components/Announcements'
import { HadithShowcase } from './components/HadithShowcase'
import { AgendaEvents } from './components/AgendaEvents'
import { Footer } from './components/Footer'
import { TvSignage, initialTvMode } from './components/TvSignage'
import { themeBy, THEMES, type ThemeKey } from './theme'
import { useNow } from './hooks/useNow'
import { usePrayerSchedule } from './hooks/usePrayerSchedule'

const THEME_STORAGE_KEY = 'salsabila-theme'
const TV_STORAGE_KEY = 'salsabila-tv'

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return (saved as ThemeKey) || 'emerald'
  })
  const [tvMode, setTvMode] = useState<boolean>(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('tv') === '0' || q.get('mode') === 'normal') return false
    if (q.get('tv') === '1' || q.get('mode') === 'tv') return true
    if (localStorage.getItem(TV_STORAGE_KEY) === '1') return true
    return initialTvMode()
  })
  const theme = themeBy(themeKey)
  const now = useNow(1000)
  const { schedule, status, sourceLabel, city, refresh } = usePrayerSchedule()

  const nextTheme = useCallback(() => {
    setThemeKey((cur) => {
      const i = THEMES.findIndex((th) => th.key === cur)
      return THEMES[(i + 1) % THEMES.length].key
    })
  }, [])

  const enterTv = useCallback(() => {
    setTvMode(true)
    localStorage.setItem(TV_STORAGE_KEY, '1')
    const url = new URL(window.location.href)
    url.searchParams.set('tv', '1')
    window.history.replaceState(null, '', url.toString())
  }, [])

  const exitTv = useCallback(() => {
    setTvMode(false)
    localStorage.setItem(TV_STORAGE_KEY, '0')
    const url = new URL(window.location.href)
    url.searchParams.delete('tv')
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeKey)
    const r = document.documentElement
    r.style.colorScheme = theme.isDark ? 'dark' : 'light'
    r.style.setProperty('--bg', theme.raw.bg)
    r.style.setProperty('--surface', theme.raw.surface)
    r.style.setProperty('--ink', theme.raw.ink)
    r.style.setProperty('--ink-soft', theme.raw.inkSoft)
    r.style.setProperty('--accent', theme.raw.accent)
    r.style.setProperty('--gold', theme.raw.gold)
    r.style.setProperty('--border', theme.isDark ? 'rgba(78, 214, 244, 0.91)' : '#e2e8f0')
    r.style.setProperty('--chip-bg', theme.isDark ? 'rgb(219, 236, 247)' : '#f8fafc')
    r.style.setProperty('--hover-bg', theme.isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(96, 228, 89, 0.04)')
    document.body.style.background = theme.raw.bg
    document.body.style.color = theme.raw.ink
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme.raw.accent)
    else {
      const m = document.createElement('meta')
      m.name = 'theme-color'
      m.content = theme.raw.accent
      document.head.appendChild(m)
    }
  }, [themeKey, theme])

  const handleOpenPrayerList = () => {
    document.getElementById('jadwal')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (tvMode) {
    return (
      <TvSignage
        theme={theme}
        schedule={schedule}
        city={city}
        now={now}
        onExit={exitTv}
        onToggleTheme={nextTheme}
      />
    )
  }

  return (
    <div id="top" className="min-h-screen transition-colors duration-500" style={{ background: theme.raw.bg }}>
      <Navbar theme={theme} onThemeChange={setThemeKey} onEnterTv={enterTv} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 md:pt-28 lg:px-8">
        <PrayerHero
          theme={theme}
          schedule={schedule}
          sourceLabel={sourceLabel}
          city={city}
          now={now}
          onRefresh={refresh}
          onOpenPrayerList={handleOpenPrayerList}
        />

        <div className="mt-12 space-y-14 md:mt-16 md:space-y-20 lg:mt-20">
          <PrayerSchedule
            theme={theme}
            schedule={schedule}
            status={status}
            sourceLabel={sourceLabel}
            now={now}
          />
          <HijriCalendar theme={theme} now={now} />
          <Announcements theme={theme} />
          <HadithShowcase theme={theme} />
          <AgendaEvents theme={theme} />
        </div>

        <Footer theme={theme} />
      </main>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full text-white shadow-xl ring-1 ring-white/30 transition hover:scale-110"
        style={{ background: `linear-gradient(135deg, ${theme.raw.accent}, ${theme.raw.primaryDeep})` }}
        aria-label="Kembali ke atas"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m18 15-6-6-6 6" />
        </svg>
      </motion.button>

      {/* Mode TV shortcut */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        onClick={enterTv}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl ring-1 ring-white/30 transition hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${theme.raw.primaryDeep}, ${theme.raw.accent})` }}
        title="Mode TV / Signage (untuk papan info masjid)"
      >
        <MonitorPlay className="h-5 w-5" />
        Mode TV
      </motion.button>
    </div>
  )
}