import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Database, ShieldCheck, Zap } from 'lucide-react'
import { gsap } from 'gsap'

const cards = [
  {
    title: 'Tenant Isolation',
    value: '99.99%',
    detail: 'Isolation checks passing across requests',
    icon: ShieldCheck,
  },
  {
    title: 'API Throughput',
    value: '12.4k/min',
    detail: 'Current rolling 60 second rate',
    icon: Zap,
  },
  {
    title: 'Storage Health',
    value: 'Green',
    detail: 'Primary + replica both healthy',
    icon: Database,
  },
]

export function HomePage() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardsRef.current) return

    gsap.fromTo(
      cardsRef.current.children,
      { y: 36, opacity: 0, rotateX: -12 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
      },
    )
  }, [])

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid gap-8 pt-4 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className="mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Multi-Tenant Control Plane
          </p>
          <h1 className="max-w-xl text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--text-primary)] md:text-6xl">
            Build one product. Serve a thousand companies.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
            This frontend is optimized to visualize your backend progress: tenant boundaries, auth health, billing status,
            and operational signals in one motion-rich command surface.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent-coral)] px-6 py-3 font-semibold text-[var(--bg-deep)] transition hover:translate-y-[-2px] hover:shadow-[0_20px_60px_rgba(255,105,79,0.35)]">
            Connect Backend APIs
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/7 p-6 backdrop-blur-xl"
        >
          <div className="absolute right-[-30%] top-[-40%] h-64 w-64 rounded-full bg-[var(--accent-teal)]/30 blur-3xl" />
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Release Pulse</p>
          <div className="mt-7 space-y-4">
            {[76, 59, 88, 67, 92].map((value, idx) => (
              <div key={idx}>
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>Service {idx + 1}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.1, delay: 0.2 + idx * 0.08 }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-coral)] to-[var(--accent-teal)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section ref={cardsRef} className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.title} className="rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5 backdrop-blur-lg">
              <div className="mb-5 inline-flex rounded-xl bg-white/10 p-2 text-[var(--accent-coral)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-[var(--text-muted)]">{card.title}</p>
              <p className="mt-1 font-heading text-3xl font-semibold text-[var(--text-primary)]">{card.value}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{card.detail}</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}
