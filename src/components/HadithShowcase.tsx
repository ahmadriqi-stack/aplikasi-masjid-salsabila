import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, BadgeCheck, BookOpen } from 'lucide-react'
import type { Theme } from '../theme'
import { useReveal } from '../hooks/useReveal'
import { HADITHS, HADITH_THEMES, type Hadith } from '../data/hadith'

interface Props {
  theme: Theme
}

const THEME_LABELS: Record<Hadith['theme'], string> = {
  Iman: 'Iman',
  Ihsan: 'Ihsan',
  Akhlak: 'Akhlak',
  Ibadah: 'Ibadah',
  Muamalah: 'Muamalah',
  Ilmu: 'Ilmu',
}

export function HadithShowcase({ theme }: Props) {
  const t = theme.raw
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState<(typeof HADITH_THEMES)[number]>('Semua')

  const filtered = useMemo(
    () => (filter === 'Semua' ? HADITHS : HADITHS.filter((h) => h.theme === filter)),
    [filter],
  )

  useEffect(() => {
    setActive(0)
  }, [filter])

  useEffect(() => {
    if (paused || filtered.length <= 1) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % filtered.length)
    }, 7000)
    return () => clearInterval(id)
  }, [paused, filtered.length])

  const go = (dir: number) => {
    setActive((i) => (i + dir + filtered.length) % filtered.length)
  }

  const current = filtered[active]
  if (!current) return null

  return (
    <section id="hadis" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: t.accent }}>
            Cahaya Petunjuk
          </p>
          <h2 className="section-title mt-1">Kumpulan Hadis</h2>
          <p className="mt-2 max-w-xl text-sm" style={{ color: t.inkSoft }}>
            Mutiara sabda Nabi ﷺ yang ditampilkan dengan animasi — berganti otomatis tiap
            beberapa menit untuk menemani waktu Anda di masjid.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {HADITH_THEMES.map((th) => (
            <button
              key={th}
              onClick={() => setFilter(th)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === th ? 'text-white shadow-md' : ''
              }`}
              style={
                filter === th
                  ? { background: `linear-gradient(135deg, ${t.accent}, ${t.primaryDeep})` }
                  : { background: t.surface, color: t.inkSoft, boxShadow: `inset 0 0 0 1px var(--border)` }
              }
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={ref}
        className={`mt-6 reveal ${visible ? 'is-visible' : ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="relative overflow-hidden rounded-[2rem] text-white"
          style={{
            background: `linear-gradient(140deg, ${t.heroFrom} 0%, ${t.heroVia} 60%, ${t.heroTo} 100%)`,
          }}
        >
          {/* animated background elements */}
          <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl animate-drift" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl animate-aurora" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-arabesque" />

          {/* Progress dots */}
          <div className="relative flex items-center justify-between px-6 pt-6 md:px-10">
            <span className="chip bg-white/15 text-white ring-1 ring-white/25">
              <BookOpen className="h-3.5 w-3.5" /> Hadis {active + 1} / {filtered.length}
            </span>
            <div className="flex gap-1.5">
              {filtered.map((h, i) => (
                <button
                  key={h.id}
                  onClick={() => setActive(i)}
                  aria-label={`Hadis ${i + 1}`}
                  className="group relative h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 28 : 10,
                    background: i === active ? '#54d6f3' : 'rgba(249, 241, 241, 0.84)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative min-h-[340px] px-6 py-8 md:min-h-[320px] md:px-10 md:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 60, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -60, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col"
              >
                <Quote className="h-8 w-8 text-amber-300/80" />

                {/* Arabic */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  dir="rtl"
                  lang="ar"
                  className="mt-4 text-right font-arabic text-2xl leading-[2.2] text-amber-50 md:text-3xl"
                >
                  {current.arabic}
                </motion.p>

                {/* Translation */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="mt-5 border-l-2 pl-4 text-base leading-relaxed text-white/90 md:text-lg"
                  style={{ borderColor: '#fbbf24aa' }}
                >
                  “{current.translation}”
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs text-white/70"
                >
                  <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
                    <BadgeCheck className="h-4 w-4" /> {current.grade}
                  </span>
                  <span>{current.source}</span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 ring-1 ring-white/15">
                    {THEME_LABELS[current.theme]}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Auto-play progress bar */}
          <div className="relative h-1 w-full overflow-hidden bg-white/10">
            {!paused && filtered.length > 1 && (
              <motion.div
                key={`${current.id}-${paused}`}
                className="h-full bg-gradient-to-r from-amber-300 to-amber-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 7, ease: 'linear' }}
              />
            )}
          </div>

          {/* Nav */}
          <div className="relative flex items-center justify-between px-6 py-4 md:px-10">
            <p className="text-xs text-white/60">
              {paused ? 'Dijeda — arahkan kursor untuk melanjutkan' : 'Berganti otomatis tiap 7 detik'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Hadis sebelumnya"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 transition hover:bg-white/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Hadis berikutnya"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 transition hover:bg-white/30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mini cards */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered
            .slice(Math.max(0, active - 1), Math.max(0, active - 1) + 3)
            .map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(filtered.findIndex((x) => x.id === h.id))}
                className="card-soft p-4 text-left transition hover:-translate-y-1"
                style={h.id === current.id ? { boxShadow: `0 0 0 2px ${t.accent}` } : undefined}
              >
                <span className="chip" style={{ background: `${t.accent}14`, color: t.accent }}>
                  {THEME_LABELS[h.theme]}
                </span>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: t.inkSoft }}>{h.translation}</p>
                <p className="mt-2 text-[11px]" style={{ color: t.inkSoft, opacity: 0.7 }}>{h.narrator}</p>
              </button>
            ))}
        </div>
      </div>
    </section>
  )
}
