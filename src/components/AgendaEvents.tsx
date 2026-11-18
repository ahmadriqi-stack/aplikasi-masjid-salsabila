import { motion } from 'framer-motion'
import { CalendarClock, MapPin } from 'lucide-react'
import type { Theme } from '../theme'
import { useReveal } from '../hooks/useReveal'
import { UPCOMING_EVENTS } from '../data/events'

interface Props {
  theme: Theme
}

export function AgendaEvents({ theme }: Props) {
  const t = theme.raw
  const { ref, visible } = useReveal<HTMLDivElement>()

  const todayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' })
    .format(new Date())
    .toLowerCase()

  return (
    <section id="agenda" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
            Kegiatan Rutin
          </p>
          <h2 className="section-title mt-1">Agenda Mingguan</h2>
          <p className="mt-2 max-w-xl text-sm" style={{ color: t.inkSoft }}>
            Rangkaian halaqah dan kajian yang berlangsung setiap pekan di Masjid Salsabila.
          </p>
        </div>
        <span className="chip" style={{ background: `${t.accent}14`, color: t.accent }}>
          <CalendarClock className="h-3.5 w-3.5" /> {UPCOMING_EVENTS.length} agenda
        </span>
      </div>

      <div
        ref={ref}
        className={`mt-6 grid gap-3 reveal ${visible ? 'is-visible' : ''} md:grid-cols-2 lg:grid-cols-3`}
      >
        {UPCOMING_EVENTS.map((e, i) => {
          const isToday = todayName === e.day.toLowerCase()
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="card-soft group relative overflow-hidden p-5"
            >
              <div
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-150"
                style={{ background: t.accent }}
              />
              <div className="flex items-center gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white"
                  style={{
                    background: isToday
                      ? `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})`
                      : `${t.accent}18`,
                    color: isToday ? '#fff' : t.accent,
                  }}
                >
                  <div className="text-center leading-none">
                    <p className="text-[9px] uppercase tracking-wider opacity-80">
                      {e.time.split(':')[0]}
                    </p>
                    <p className="text-lg font-bold">{e.time.split(':')[1]}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: isToday ? t.accent : t.inkSoft }}
                    >
                      {e.day}
                    </span>
                    {isToday && (
                      <span
                        className="chip px-2 py-0 text-[9px] text-white"
                        style={{ background: t.accent }}
                      >
                        Hari ini
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold" style={{ color: t.ink }}>{e.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: t.inkSoft }}>{e.description}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: t.inkSoft, opacity: 0.75 }}>
                <MapPin className="h-3.5 w-3.5" /> Masjid Salsabila
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
