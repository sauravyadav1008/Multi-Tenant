import { useEffect } from 'react'
import Lenis from 'lenis'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { AnimatedBackground } from './components/AnimatedBackground'
import { HomePage } from './pages/HomePage'
import { WorkspacePage } from './pages/WorkspacePage'
import { useAuthStore } from './store/auth.store'

function App() {
  const bootstrapping = useAuthStore((state) => state.bootstrapping)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    void initializeAuth()
  }, [initializeAuth])

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)]">
        <AnimatedBackground />
        <Navbar />

        <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-6 md:px-10 md:pt-10">
          {bootstrapping ? (
            <div className="grid min-h-[50vh] place-items-center">
              <p className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-[var(--text-muted)]">
                Establishing secure session...
              </p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
