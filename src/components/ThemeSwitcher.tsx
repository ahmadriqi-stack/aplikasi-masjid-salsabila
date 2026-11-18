import { useState, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { THEMES, type Theme, type ThemeKey } from '../theme'

interface Props {
  theme: Theme
  onChange: (key: ThemeKey) => void
}

export function ThemeSwitcher({ theme, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const t = theme.raw

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-ghost"
        style={{
          background: t.surface,
          color: t.ink,
          boxShadow: `inset 0 0 0 1px var(--border)`,
        }}
        aria-label="Ganti tema warna"
      >
        <Palette className="h-4 w-4" style={{ color: t.accent }} />
        <span className="hidden sm:inline">{theme.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl p-3 shadow-2xl"
              style={{ background: t.surface, boxShadow: `0 25px 50px rgba(0,0,0,0.25), inset 0 0 0 1px var(--border)` }}
            >
              <p
                className="px-2 pb-2 pt-1 text-xs font-bold uppercase tracking-widest"
                style={{ color: t.inkSoft, opacity: 0.7 }}
              >
                Tema Tampilan
              </p>
              <div className="space-y-1">
                {THEMES.map((th) => {
                  const isActive = th.key === theme.key
                  return (
                    <button
                      key={th.key}
                      onClick={() => {
                        onChange(th.key)
                        setOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
                      style={{
                        background: isActive ? 'var(--hover-bg)' : 'transparent',
                      }}
                    >
                      <span className="flex shrink-0">
                        {th.swatch.map((c) => (
                          <span
                            key={c}
                            className="h-6 w-6 rounded-full ring-2"
                            style={{ background: c, marginLeft: -8, '--tw-ring-color': t.surface } as CSSProperties}
                          />
                        ))}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold" style={{ color: t.ink }}>
                          {th.name}
                        </span>
                        <span className="block text-[11px]" style={{ color: t.inkSoft }}>
                          {th.desc}
                        </span>
                      </span>
                      {isActive && (
                        <Check className="h-4 w-4 shrink-0" style={{ color: th.swatch[0] }} />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
