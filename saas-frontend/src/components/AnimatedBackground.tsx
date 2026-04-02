import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-20 top-16 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,var(--accent-coral),transparent_68%)] blur-3xl"
        animate={{ x: [0, 60, -30, 0], y: [0, -30, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-7rem] top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,var(--accent-teal),transparent_72%)] blur-3xl"
        animate={{ x: [0, -40, 20, 0], y: [0, 50, -20, 0], scale: [1, 0.95, 1.08, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,13,24,0.15),rgba(7,13,24,0.88))]" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:20px_20px]" />
    </div>
  )
}
