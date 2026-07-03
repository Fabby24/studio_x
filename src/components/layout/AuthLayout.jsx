import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    title: 'Project tracking',
    description: 'Watch every brief move from kickoff to delivery.',
  },
  {
    title: 'Team coordination',
    description: 'Keep designers, writers and editors on one timeline.',
  },
  {
    title: 'Time logging',
    description: 'See where hours go, project by project.',
  },
  {
    title: 'Smart scheduling',
    description: 'Spot bottlenecks before they slow a deadline.',
  },
]

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0B132B] overflow-hidden font-poppins">
      {/* Left Section - Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2563EB] to-[#7C3AED] items-center justify-center p-12 relative overflow-hidden">

        <div className="absolute inset-0 opacity-[0.07]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="brand-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#brand-grid)"/>
          </svg>
        </div>

        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#06B6D4]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#7C3AED]/30 blur-3xl" />

        <div className="relative z-10 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex justify-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 border border-white/15">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="5" cy="14" r="2.5" fill="white" />
                  <circle cx="14" cy="6" r="2.5" fill="white" />
                  <circle cx="14" cy="22" r="2.5" fill="white" />
                  <circle cx="23" cy="14" r="2.5" fill="white" />
                  <path d="M7 13L12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7 15L12 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 8L21 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 20L21 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white tracking-tight">STUDIO X</h1>
                <p className="text-[10px] text-white/60 tracking-[0.2em]">TRAFFIC MANAGEMENT SYSTEM</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Built for creative teams who ship.
            </h2>
            <p className="text-white/70 text-base mb-10">
              From brief to delivery, every project, deadline and
              resource stays in sync.
            </p>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="grid grid-cols-2 gap-3 mb-12"
          >
            {features.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-left transition-transform hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                <p className="text-xs text-white/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Footer */}
          <p className="text-xs text-white/30 pt-6 border-t border-white/10">
            © 2026 Studio X. All rights reserved.
          </p>
        </div>
      </div>
      
      <div className="flex flex-1 items-center justify-center p-4 bg-[#0B132B]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout