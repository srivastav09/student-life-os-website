import { NavLink } from 'react-router-dom'
import { Activity, CalendarDays, Focus, LayoutDashboard, ListTodo, MoonStar, SunMedium } from 'lucide-react'
import { cn } from '../lib/utils'
import type { ReactNode } from 'react'
import { useAppStore } from '../store/useAppStore'
import { AnimatePresence, motion } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/focus', label: 'Focus', icon: Focus },
]

export function AppShell({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--app-glow),_transparent_32%),radial-gradient(circle_at_bottom_right,_var(--app-glow-2),_transparent_28%),linear-gradient(180deg,var(--app-bg)_0%,var(--app-bg)_100%)] text-[var(--app-fg)] transition-colors duration-500">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-[var(--app-border)] p-4 md:sticky md:top-0 md:h-screen md:w-80 md:border-b-0 md:border-r md:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--app-accent)] text-[var(--app-accent-fg)] shadow-lg shadow-cyan-500/30">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">Student Life OS</p>
              <h1 className="text-xl font-semibold text-[var(--app-fg)]">Focus. Plan. Execute.</h1>
            </div>
          </div>
          <p className="mb-6 max-w-sm text-sm leading-6 text-[var(--app-muted)]">
            Offline-first student productivity built for assignments, timetables, and deep work.
          </p>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-[var(--app-muted)]">Appearance</span>
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm font-semibold text-[var(--app-fg)] shadow-lg shadow-black/10"
            >
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-60" />
              <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[var(--app-accent)] text-[var(--app-accent-fg)] shadow-md shadow-cyan-500/25">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={theme}
                    initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 40, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.22 }}
                    className="grid"
                  >
                    {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="relative pr-1">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </motion.button>
          </div>
          <nav className="hidden gap-2 md:grid">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'border-cyan-400/40 text-[var(--app-fg)]'
                      : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)] hover:opacity-90 hover:text-[var(--app-fg)]',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? <motion.span layoutId="nav-pill-desktop" className="absolute inset-0 rounded-2xl bg-cyan-400/15" transition={{ type: 'spring', stiffness: 500, damping: 40 }} /> : null}
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--app-border)] bg-[var(--app-nav-bg)] px-3 py-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                  cn(
                    'relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl px-2 py-2 text-[11px] font-semibold transition',
                  isActive ? 'text-[var(--app-fg)]' : 'text-[var(--app-muted)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <motion.span layoutId="nav-pill-mobile" className="absolute inset-0 rounded-2xl bg-cyan-400/15" transition={{ type: 'spring', stiffness: 500, damping: 40 }} /> : null}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
