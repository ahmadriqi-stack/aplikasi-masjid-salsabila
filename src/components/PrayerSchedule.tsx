import { motion } from 'framer-motion'
import { Sunrise, Sun, Moon, Sunset } from 'lucide-react'
import type { Theme } from '../theme'
import { useReveal } from '../hooks/useReveal'
import { formatTime12, findNextPrayer, type ScheduleStatus } from '../hooks/usePrayerSchedule'
import type { PrayerKey, ScheduleDay } from '../data/prayer'

interface Props {
  theme: Theme
  schedule: ScheduleDay
  status: ScheduleStatus
  sourceLabel: string
  now: Date
}

const ICONS: Record<PrayerKey, typeof Sun> = {
  Fajr: Moon,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: Sunset,
  Maghrib: Sunset,
  Isha: Moon,
}

const NOTES: Partial<Record<PrayerKey, string>> = {
  Fajr: 'Waktu sholat mulai terbit fajar hingga sebelum matahari terbit',
  Sunrise: 'Awal waktu dilarang sholat sunnah',
  Dhuhr: 'Tengah hari hingga bayang-bayang sama panjangnya',
  Asr: 'Bayang-bayang dua kali panjang benda',
  Maghrib: 'Waktu terbenamnya matahari hingga jingga hilang',
  Isha: 'Setelah terbenam hingga tengah malam',
}

export function PrayerSchedule({ theme, schedule, status, sourceLabel, now }: Props) {
  const t = theme.raw
  const { ref, visible } = useReveal<HTMLDivElement>()
  const { next, current, secondsUntilNext, progress } = findNextPrayer(schedule.times, now)

  return (
    <section id="jadwal" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
            Jadwal Harian
          </p>
          <h2 className="section-title mt-1">Jadwal Sholat Hari Ini</h2>
          <p className="mt-2 max-w-lg text-sm" style={{ color: t.inkSoft }}>{schedule.date} · {schedule.hijri}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: t.inkSoft }}>
          <span
            className={`chip ${
              status === 'live'
                ? 'ring-1'
                : status === 'fallback'
                  ? 'ring-1'
                  : 'ring-1'
            }`}
            style={
              status === 'live'
                ? { background: `${t.accent}18`, color: t.accent, boxShadow: `inset 0 0 0 1px ${t.accent}44` }
                : status === 'fallback'
                  ? { background: '#fbbf2422', color: '#d97706', boxShadow: 'inset 0 0 0 1px #fbbf2455' }
                  : { background: 'var(--chip-bg)', color: t.inkSoft, boxShadow: 'inset 0 0 0 1px var(--border)' }
            }
          >
            {status === 'live' ? 'Langsung' : status === 'fallback' ? 'Contoh' : 'Memuat…'}
          </span>
          {sourceLabel && <span>{sourceLabel}</span>}
        </div>
      </div>

      <div ref={ref} className={`mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 reveal ${visible ? 'is-visible' : ''}`}>
        {schedule.times.map((p, i) => {
          const Icon = ICONS[p.key]
          const isNext = next?.key === p.key
          const isCurrent = current === p.key
          const style = isNext
            ? {
                background: `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})`,
                borderColor: 'transparent',
                color: t.onAccent,
              }
            : isCurrent
              ? { background: t.surface, borderColor: `${t.gold}55`, color: t.ink }
              : { background: t.surface, borderColor: 'var(--border)', color: t.ink }

          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl border p-5 shadow-[0_10px_40px_-16px_rgba(15,23,42,0.2)] transition-transform duration-300 hover:-translate-y-1"
              style={style}
            >
              {isNext && (
                <>
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                  <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-black/10">
                    <motion.div
                      className="h-full bg-white/70"
                      animate={{ width: `${Math.round(progress * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-11 w-11 place-items-center rounded-2xl"
                    style={{
                      background: isNext ? 'rgba(255,255,255,0.18)' : `${t.accent}14`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: isNext ? t.onAccent : t.accent }}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: isNext ? t.onAccent : t.ink }}>
                      {p.name}
                    </p>
                    <p
                      className="font-arabic text-sm"
                      style={{ color: isNext ? 'rgba(255,255,255,0.75)' : t.inkSoft }}
                      dir="rtl"
                    >
                      {p.arabic}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="font-display text-3xl font-semibold tabular-nums lining-nums"
                    style={{ color: isNext ? t.onAccent : t.ink }}
                  >
                    {p.time}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: isNext ? 'rgba(255,255,255,0.75)' : t.inkSoft }}
                  >
                    {formatTime12(p.time)}
                  </p>
                </div>
              </div>

              {NOTES[p.key] && (
                <p
                  className="mt-3 text-[11px] leading-relaxed"
                  style={{ color: isNext ? 'rgba(255,255,255,0.7)' : t.inkSoft }}
                >
                  {NOTES[p.key]}
                </p>
              )}

              {isNext && (
                <span className="absolute left-5 top-4 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Berikutnya · {formatCountdown(secondsUntilNext)}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}j ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}d`
  return `${sec}s`
}
