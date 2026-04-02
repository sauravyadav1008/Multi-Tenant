import { useState } from 'react'
import type { FormEvent } from 'react'
import { useUIStore } from '../store/ui.store'
import { useAuthStore } from '../store/auth.store'

const tenants = [
  { name: 'Aurora Labs', users: 42, plan: 'Growth' },
  { name: 'BlueHarbor Inc', users: 13, plan: 'Starter' },
  { name: 'Cinder Systems', users: 109, plan: 'Enterprise' },
]

export function WorkspacePage() {
  const commandOpen = useUIStore((state) => state.commandOpen)
  const setCommandOpen = useUIStore((state) => state.setCommandOpen)
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isLoading = useAuthStore((state) => state.isLoading)
  const authError = useAuthStore((state) => state.error)
  const register = useAuthStore((state) => state.register)
  const login = useAuthStore((state) => state.login)
  const refresh = useAuthStore((state) => state.refresh)
  const me = useAuthStore((state) => state.me)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [localMessage, setLocalMessage] = useState<string | null>(null)

  const handleRegister = async () => {
    setLocalMessage(null)

    try {
      await register({ email, password, companyName })
      setLocalMessage('Account registered and session established.')
    } catch {
      setLocalMessage(null)
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    setLocalMessage(null)

    try {
      await login({ email, password })
      setLocalMessage('Logged in successfully.')
    } catch {
      setLocalMessage(null)
    }
  }

  const handleRefresh = async () => {
    setLocalMessage(null)

    try {
      await refresh()
      setLocalMessage('Token refreshed from secure cookie.')
    } catch {
      setLocalMessage(null)
    }
  }

  const handleMe = async () => {
    setLocalMessage(null)

    try {
      await me()
      setLocalMessage('Fetched current user from /auth/me.')
    } catch {
      setLocalMessage(null)
    }
  }

  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Backend Tracking Surface</p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">Tenant Workspace</h2>
        </div>
        <button
          onClick={() => setCommandOpen(!commandOpen)}
          className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/10"
        >
          {commandOpen ? 'Hide command bar' : 'Open command bar'}
        </button>
      </div>

      {commandOpen && (
        <div className="rounded-2xl border border-[var(--accent-teal)]/40 bg-[var(--accent-teal)]/15 p-4 text-sm text-[var(--text-primary)]">
          Quick commands: sync auth health, pull billing events, check tenant isolation status.
        </div>
      )}

      <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Auth Bridge</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Register/login create a refresh cookie and receive an access token from backend.
          </p>

          <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={handleLogin}>
            <input
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)] focus:border-white/35"
              type="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)] focus:border-white/35"
              type="password"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <input
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-[var(--text-primary)] outline-none ring-0 placeholder:text-[var(--text-muted)] focus:border-white/35"
              type="text"
              placeholder="companyName (register only)"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
            />

            <div className="md:col-span-3 flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full border border-[var(--accent-teal)]/45 bg-[var(--accent-teal)]/20 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--accent-teal)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => void handleRegister()}
                disabled={isLoading || !companyName}
                className="rounded-full border border-[var(--accent-coral)]/45 bg-[var(--accent-coral)]/20 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[var(--accent-coral)]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={isLoading}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Refresh
              </button>
              <button
                type="button"
                onClick={() => void handleMe()}
                disabled={isLoading || !accessToken}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Me
              </button>
            </div>
          </form>

          {(authError || localMessage) && (
            <p className="mt-3 text-sm text-[var(--text-primary)]">
              {authError ? `Error: ${authError}` : localMessage}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm md:min-w-[17rem]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Session Snapshot</p>
          <p className="mt-3 text-[var(--text-muted)]">Status: {user ? 'Authenticated' : 'Guest'}</p>
          <p className="mt-1 text-[var(--text-muted)]">User: {user?.email || 'n/a'}</p>
          <p className="mt-1 text-[var(--text-muted)]">Role: {user?.role || 'n/a'}</p>
          <p className="mt-1 text-[var(--text-muted)]">Tenant: {user?.tenantId || 'n/a'}</p>
          <p className="mt-3 break-all text-[var(--text-muted)]">Access token: {accessToken ? 'present' : 'missing'}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-[var(--text-muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Tenant</th>
              <th className="px-5 py-3 font-medium">Users</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.name} className="border-t border-white/10">
                <td className="px-5 py-4 font-medium text-[var(--text-primary)]">{tenant.name}</td>
                <td className="px-5 py-4 text-[var(--text-muted)]">{tenant.users}</td>
                <td className="px-5 py-4 text-[var(--text-muted)]">{tenant.plan}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    Healthy
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
