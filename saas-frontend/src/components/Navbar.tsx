import { motion } from 'framer-motion'
import { Building2, LogOut, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useAuthStore } from '../store/auth.store'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/workspace', label: 'Workspace' },
]

export function Navbar() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const logoutAll = useAuthStore((state) => state.logoutAll)

  return (
    <header className="relative z-20 border-b border-white/10 bg-black/10 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group inline-flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 ring-1 ring-white/25 transition group-hover:bg-white/15">
            <Building2 className="h-5 w-5 text-[var(--text-primary)]" />
          </div>
          <div>
            <p className="font-heading text-base font-semibold tracking-tight text-[var(--text-primary)]">OrbitTenant</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">SaaS Console</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => cn('relative rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-primary)]', isActive && 'text-[var(--text-primary)]')}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/15"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/15 px-3 py-2 text-sm font-semibold text-emerald-200 md:inline-flex">
              <ShieldCheck className="h-4 w-4" />
              {user.email}
            </div>
            <button
              onClick={() => void logout()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button
              onClick={() => void logoutAll()}
              className="hidden items-center gap-2 rounded-full border border-[var(--accent-coral)]/50 bg-[var(--accent-coral)]/20 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--accent-coral)]/30 md:inline-flex"
            >
              <Sparkles className="h-4 w-4" />
              Logout All
            </button>
          </div>
        ) : (
          <button className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-teal)]/40 bg-[var(--accent-teal)]/20 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:translate-y-[-1px] hover:bg-[var(--accent-teal)]/30">
            <Sparkles className="h-4 w-4" />
            Session Needed
          </button>
        )}
      </div>
    </header>
  )
}
