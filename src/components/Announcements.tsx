import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, MapPin, Clock, Calendar, Info, AlertTriangle, Siren, PartyPopper } from 'lucide-react'
import type { Theme } from '../theme'
import { useReveal } from '../hooks/useReveal'
import { ANNOUNCEMENTS, LEVEL_STYLES, type Announcement, type AnnouncementLevel } from '../data/announcements'

interface Props {
  theme: Theme
}

const LEVEL_ICONS: Record<AnnouncementLevel, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  urgent: Siren,
  event: PartyPopper,
}

const FILTERS: Array<'Semua' | AnnouncementLevel> = ['Semua', 'event', 'urgent', 'warning', 'info']
const FILTER_LABELS: Record<string, string> = {
  Semua: 'Semua',
  event: 'Kegiatan',
  urgent: 'Penting',
  warning: 'Peringatan',
  info: 'Informasi',
}

export function Announcements({ theme }: Props) {
  const t = theme.raw
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [filter, setFilter] = useState<'Semua' | AnnouncementLevel>('Semua')

  const items = useMemo(
    () =>
      filter === 'Semua'
        ? ANNOUNCEMENTS
        : ANNOUNCEMENTS.filter((a) => a.level === filter),
    [filter],
  )

  const ticker = useMemo(() => ANNOUNCEMENTS.slice(0, 5).map((a) => a.title), [])

  return (
    <section id="pengumuman" className="scroll-mt-24">
      {/* Running ticker */}
      <div
        className="mb-6 flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 ring-1"
        style={{ background: `${t.accent}10`, borderColor: `${t.accent}33` }}
      >
        <span
          className="chip shrink-0"
          style={{ background: t.accent, color: t.onAccent }}
        >
          <Megaphone className="h-3.5 w-3.5" /> Terkini
        </span>
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex w-max gap-10 whitespace-nowrap text-sm font-medium"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...ticker, ...ticker, ...ticker, ...ticker].map((title, i) => (
              <span key={`${title}-${i}`} className="flex items-center gap-3" style={{ color: t.inkSoft }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.gold }} />
                {title}
              </span>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8" style={{ background: `linear-gradient(to right, var(--bg), transparent)` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8" style={{ background: `linear-gradient(to left, var(--bg), transparent)` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
            Papan Pengumuman
          </p>
          <h2 className="section-title mt-1">Informasi Terkini</h2>
          <p className="mt-2 max-w-xl text-sm" style={{ color: t.inkSoft }}>
            Kabar kegiatan, pengingat, dan pemberitahuan resmi dari pengurus Masjid Salsabila.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f ? 'text-white shadow-md' : ''
              }`}
              style={
                filter === f
                  ? { background: `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})` }
                  : { background: t.surface, color: t.inkSoft, boxShadow: `inset 0 0 0 1px var(--border)` }
              }
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={ref}
        className={`mt-6 grid gap-4 md:grid-cols-2 reveal ${visible ? 'is-visible' : ''}`}
      >
        <AnimatePresence>
          {items.map((a, i) => (
            <AnnouncementCard key={a.id} a={a} theme={theme} index={i} visible={visible} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

function AnnouncementCard({
  a,
  theme,
  index,
  visible,
}: {
  a: Announcement
  theme: Theme
  index: number
  visible: boolean
}) {
  const t = theme.raw
  const meta = LEVEL_STYLES[a.level]
  const Icon = LEVEL_ICONS[a.level]

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-soft group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, ${t.accent}, ${t.gold})` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${meta.chip}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <span className={`chip ${meta.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            <h3 className="mt-1.5 font-display text-xl font-semibold" style={{ color: t.ink }}>{a.title}</h3>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed" style={{ color: t.inkSoft }}>{a.body}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs" style={{ color: t.inkSoft }}>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {a.date}
        </span>
        {a.time && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {a.time}
          </span>
        )}
        {a.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {a.location}
          </span>
        )}
      </div>
    </motion.article>
  )
}
