import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'
import type { Theme } from '../theme'

interface Props {
  theme: Theme
}

export function Footer({ theme }: Props) {
  const t = theme.raw

  return (
    <footer className="relative overflow-hidden text-white" style={{ background: t.primaryDeep }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-arabesque" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/20">
                <img src="/logo.png" alt="Logo Masjid Salsabila" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Masjid</p>
                <h3 className="font-display text-3xl font-semibold">Salsabila</h3>
              </div>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Pusat ibadah, pendidikan, dan kebersamaan umat. Menjadi rumah yang menenangkan
              bagi setiap jamaah yang datang.
            </p>
            <div className="mt-4 flex gap-2">
              {['Jamaah', 'Takmir', 'Marbot'].map((r) => (
                <span key={r} className="chip bg-white/10 text-white/80 ring-1 ring-white/15">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Navigasi</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ['#jadwal', 'Jadwal Sholat'],
                ['#kalender', 'Tanggal Hijriyah'],
                ['#pengumuman', 'Papan Pengumuman'],
                ['#hadis', 'Kumpulan Hadis'],
                ['#agenda', 'Agenda Mingguan'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-white/70 transition hover:text-amber-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">Kontak</p>
            <ul className="mt-3 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                Jl. Ki Mangunsarkoro No. 30, Bekasi Timur, Kota Bekasi
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-300" />
                +62 1617-8092-71
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-300" />
                Sugono, M.Pd.
              </li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row"
        >
          <p>© {new Date().getFullYear()} Masjid Salsabila — Seluruh hak cipta dilindungi.</p>
          <p className="inline-flex items-center gap-1.5">
            Dibuat dengan <Heart className="h-3.5 w-3.5 text-rose-400" fill="currentColor" /> untuk umat
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
