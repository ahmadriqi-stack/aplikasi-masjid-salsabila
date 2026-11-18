import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, RefreshCw } from 'lucide-react'
import type { Theme } from '../theme'
import { formatCountdown, formatTime12, findNextPrayer } from '../hooks/usePrayerSchedule'
import { getHijriInfo } from '../hooks/useHijri'
import type { ScheduleDay } from '../data/prayer'

interface Props {
  theme: Theme
  schedule: ScheduleDay
  sourceLabel: string
  city: string
  now: Date
  onRefresh: () => void
  onOpenPrayerList: () => void
}

export function PrayerHero({
  theme,
  schedule,
  sourceLabel,
  city,
  now,
  onRefresh,
  onOpenPrayerList,
}: Props) {
  const t = theme.raw
  const hijri = getHijriInfo(now)
  const { next, secondsUntilNext, progress, current } = findNextPrayer(schedule.times, now)

  const clock = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] text-white"
      style={{
        background: `linear-gradient(135deg, ${t.heroFrom} 0%, ${t.heroVia} 55%, ${t.heroTo} 100%)`,
      }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-[#fbbf24]/20 blur-3xl animate-aurora" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-teal-300/10 blur-2xl animate-drift" />

      {/* Arabesque overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-arabesque" />

      <div className="relative px-6 py-8 md:px-10 md:py-10">
        {/* Top row: brand + date */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/30">
              <img src="/logo.png" alt="Logo Masjid Salsabila" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Masjid</p>
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                Salsabila
              </h1>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/70">{hijri.gregorian}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-white/25">
              <CalendarDays className="h-3 w-3" />
              {hijri.hijri}
            </span>
          </div>
        </div>

        {/* Middle: clock + countdown */}
        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">
              Waktu setempat · {city}
            </p>
            <div className="mt-1 flex items-end gap-3">
              <span className="font-display text-6xl md:text-7xl lg:text-8xl font-semibold tabular-nums lining-nums tracking-tight">
                {clock}
              </span>
              <span className="mb-2 hidden sm:inline-flex chip bg-white/15 text-white ring-1 ring-white/25">
                {hijri.isRamadhan ? 'Bulan Ramadhan' : hijri.monthName}
              </span>
            </div>
            {sourceLabel && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                <MapPin className="h-3.5 w-3.5" />
                {sourceLabel}
              </p>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div
                key={next.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Menjelang {next.name}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold tabular-nums lining-nums">{next.time}</span>
                  <span className="text-sm text-white/70">{formatTime12(next.time)}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Waktu tersisa</span>
                    <span className="tabular-nums">{formatCountdown(secondsUntilNext)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(progress * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/25 transition hover:bg-white/25"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Muat ulang
              </button>
              <button
                onClick={onOpenPrayerList}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-300/90 px-3 py-1.5 text-xs font-semibold text-amber-950 transition hover:bg-amber-200"
              >
                Lihat Semua Jadwal
              </button>
            </div>
          </div>
        </div>

        {/* Prayer chips */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {schedule.times.map((p) => {
            const isActive =
              (p.key === 'Fajr' && current === 'Fajr') ||
              (p.key === 'Sunrise' && current === 'Fajr') ||
              (p.key === 'Dhuhr' && current === 'Dhuhr') ||
              (p.key === 'Asr' && current === 'Asr') ||
              (p.key === 'Maghrib' && current === 'Maghrib') ||
              (p.key === 'Isha' && current === 'Isha')
            return (
              <div
                key={p.key}
                className={`flex min-w-[92px] flex-col items-center rounded-2xl px-3 py-2 ring-1 transition ${
                  isActive
                    ? 'bg-amber-300 text-amber-950 ring-amber-200'
                    : 'bg-white/10 text-white/85 ring-white/15'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">{p.name}</span>
                <span className="font-display text-lg font-semibold tabular-nums lining-nums">{p.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CalendarDays(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}
