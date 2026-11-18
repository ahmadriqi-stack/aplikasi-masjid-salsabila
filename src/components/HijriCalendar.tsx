import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import type { Theme } from '../theme'
import { useReveal } from '../hooks/useReveal'
import { formatHijriMonthYear, getHijriInfo } from '../hooks/useHijri'

interface Props {
  theme: Theme
  now: Date
}

interface CalendarCell {
  key: string
  day: number
  isToday: boolean
  isCurrentMonth: boolean
}

const WEEKDAYS_ID = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Ah']
// Monday-first index mapping (0=Mon)
const toMondayFirst = (d: number) => (d + 6) % 7

function buildCells(monthStart: Date, today: Date): CalendarCell[] {
  const year = monthStart.getFullYear()
  const month = monthStart.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const lead = toMondayFirst(firstDay.getDay())

  const cells: CalendarCell[] = []
  const prevDays = new Date(year, month, 0).getDate()
  for (let i = lead - 1; i >= 0; i--) {
    cells.push({
      key: `prev-${i}`,
      day: prevDays - i,
      isToday: false,
      isCurrentMonth: false,
    })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
    cells.push({
      key: `cur-${d}`,
      day: d,
      isToday,
      isCurrentMonth: true,
    })
  }
  let nextD = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      key: `next-${nextD}`,
      day: nextD,
      isToday: false,
      isCurrentMonth: false,
    })
    nextD++
  }
  return cells
}

function hijriFor(day: number, monthStart: Date): string {
  const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)
  const info = getHijriInfo(d)
  // extract numeric day from "21 Rabiʻul Awwal 1448 H"
  const num = parseInt(info.hijri, 10)
  return Number.isFinite(num) ? String(num) : String(day)
}

const MONTH_YEAR_FORMAT = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
})

export function HijriCalendar({ theme, now }: Props) {
  const t = theme.raw
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [offset, setOffset] = useState(0)

  // `now` ticks every second; key the calendar on the calendar day only
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

  const monthStart = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() + offset, 1),
    [dayKey, offset],
  )

  const cells = useMemo(
    () => buildCells(monthStart, new Date(now.getFullYear(), now.getMonth(), now.getDate())),
    [monthStart, dayKey],
  )
  const hijriToday = getHijriInfo(now)

  const monthLabel = MONTH_YEAR_FORMAT.format(monthStart)

  // Hijri month label of the current visible month (from its 1st)
  const hijriMonthLabel = useMemo(
    () => formatHijriMonthYear(monthStart) ?? hijriToday.hijri,
    [monthStart, hijriToday.hijri],
  )

  return (
    <section id="kalender" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
            Kalender
          </p>
          <h2 className="section-title mt-1">Tanggal Hijriyah</h2>
          <p className="mt-2 text-sm" style={{ color: t.inkSoft }}>
            Diperbarui otomatis setiap hari mengikuti sistem kalender Umm al-Qura.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border transition"
            style={{ background: t.surface, borderColor: 'var(--border)', color: t.inkSoft }}
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border transition"
            style={{ background: t.surface, borderColor: 'var(--border)', color: t.inkSoft }}
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className={`mt-6 reveal ${visible ? 'is-visible' : ''} grid gap-5 lg:grid-cols-[1.4fr_1fr]`}
      >
        {/* Calendar card */}
        <div className="card-soft overflow-hidden">
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-5"
            style={{ background: `linear-gradient(120deg, ${t.primary}, ${t.primaryDeep})` }}
          >
            <div>
              <p className="font-display text-xl font-semibold text-white">{monthLabel}</p>
              <p className="text-xs text-white/75">{hijriMonthLabel}</p>
            </div>
            {offset !== 0 && (
              <button
                onClick={() => setOffset(0)}
                className="chip bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25"
              >
                <Sparkles className="h-3 w-3" /> Bulan ini
              </button>
            )}
          </div>

          <div className="px-4 py-4">
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS_ID.map((w) => (
                <div key={w} className="pb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: t.inkSoft, opacity: 0.7 }}>
                  {w}
                </div>
              ))}
              {cells.map((c, idx) => (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={visible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: Math.min(idx * 0.005, 0.4), duration: 0.3 }}
                  className={`relative rounded-xl py-1.5 text-center transition ${
                    c.isToday
                      ? 'shadow-lg'
                      : c.isCurrentMonth
                        ? 'hover:bg-[var(--hover-bg)]'
                        : 'opacity-40'
                  }`}
                  style={
                    c.isToday
                      ? { background: `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})` }
                      : undefined
                  }
                >
                  <div
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: c.isToday ? '#fff' : c.isCurrentMonth ? t.ink : t.inkSoft }}
                  >
                    {c.day}
                  </div>
                  <div
                    className="text-[9px] leading-tight"
                    style={{ color: c.isToday ? 'rgba(255,255,255,0.8)' : t.inkSoft }}
                  >
                    {c.isCurrentMonth ? hijriFor(c.day, monthStart) : ''}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Today panel */}
        <div className="flex flex-col gap-4">
          <div
            className="relative overflow-hidden rounded-3xl p-6 text-white"
            style={{
              background: `linear-gradient(150deg, ${t.goldDeep}, ${t.gold})`,
            }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <p className="text-xs uppercase tracking-[0.25em] text-white/80">Hari ini</p>
            <p className="mt-2 font-display text-3xl font-semibold">{hijriToday.dayName}</p>
            <p className="mt-1 text-sm text-white/90">{hijriToday.gregorian}</p>
            <div className="mt-4 inline-flex rounded-2xl bg-white/20 px-4 py-2 ring-1 ring-white/30">
              <span className="font-arabic text-lg">{hijriToday.hijri}</span>
            </div>
            {hijriToday.isRamadhan && (
              <p className="mt-3 rounded-xl bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold">
                Marhaban ya Ramadhan — Bulan penuh berkah
              </p>
            )}
          </div>

          <div className="card-soft p-5">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.inkSoft, opacity: 0.75 }}>
              Catatan Kalender
            </p>
            <ul className="mt-3 space-y-2.5 text-sm" style={{ color: t.inkSoft }}>
              {[
                'Tanggal Hijriyah dihitung otomatis via kalender Umm al-Qura.',
                'Penetapan 1 Syawal mengikuti rukyatul hilal & hisab.',
                'Seluruh waktu sholat mengikuti metode Kemenag RI (method 20).',
              ].map((txt) => (
                <li key={txt} className="flex gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: t.accent }}
                  />
                  {txt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
