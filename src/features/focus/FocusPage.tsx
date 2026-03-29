import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlarmClock, Flame, Pause, Play, RotateCcw, Skull } from 'lucide-react'
import { Badge, Button, Card, GhostButton, Input, Label } from '../../components/ui'
import { formatClock } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

export function FocusPage() {
  const focus = useAppStore((state) => state.focus)
  const startFocus = useAppStore((state) => state.startFocus)
  const pauseFocus = useAppStore((state) => state.pauseFocus)
  const resetFocus = useAppStore((state) => state.resetFocus)
  const tickFocus = useAppStore((state) => state.tickFocus)
  const setFocusPreset = useAppStore((state) => state.setFocusPreset)
  const addDistraction = useAppStore((state) => state.addDistraction)

  useEffect(() => {
    if (!focus.isRunning) return
    const timer = window.setInterval(() => tickFocus(), 1000)
    return () => window.clearInterval(timer)
  }, [focus.isRunning, tickFocus])

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="space-y-5 overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--app-muted)]">Focus mode</p>
            <h2 className="text-2xl font-semibold text-[var(--app-fg)]">Pomodoro with attitude</h2>
          </div>
          <Badge>{focus.phase}</Badge>
        </div>
        <motion.div animate={{ scale: focus.isRunning ? [1, 1.01, 1] : 1 }} transition={{ duration: 1.4, repeat: focus.isRunning ? Number.POSITIVE_INFINITY : 0 }} className="grid place-items-center rounded-[2rem] border border-cyan-400/20 bg-[var(--app-surface-strong)] py-12 shadow-inner shadow-cyan-500/5">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-500/80">Remaining</p>
          <p className="mt-3 text-6xl font-black sm:text-7xl">{formatClock(focus.remainingSeconds)}</p>
        </motion.div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={startFocus}><Play className="mr-2 h-4 w-4" />Start</Button>
            <GhostButton onClick={pauseFocus}><Pause className="mr-2 h-4 w-4" />Pause</GhostButton>
            <GhostButton onClick={resetFocus}><RotateCcw className="mr-2 h-4 w-4" />Reset</GhostButton>
            <GhostButton onClick={addDistraction}><Skull className="mr-2 h-4 w-4" />Add distraction</GhostButton>
          </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <div className="mb-4 flex items-center justify-between"><p className="text-sm text-[var(--app-muted)]">Preset</p><Flame className="h-5 w-5 text-orange-300" /></div>
          <div className="grid grid-cols-2 gap-3">
            <GhostButton onClick={() => setFocusPreset(25, 5)}>25 / 5</GhostButton>
            <GhostButton onClick={() => setFocusPreset(50, 10)}>50 / 10</GhostButton>
          </div>
        </Card>
        <Card className="space-y-3">
          <Label htmlFor="focusMinutes">Custom focus minutes</Label>
          <Input id="focusMinutes" type="number" min={5} max={120} defaultValue={focus.focusMinutes} onChange={(e) => setFocusPreset(Number(e.target.value), focus.breakMinutes)} />
          <Label htmlFor="breakMinutes">Custom break minutes</Label>
          <Input id="breakMinutes" type="number" min={1} max={30} defaultValue={focus.breakMinutes} onChange={(e) => setFocusPreset(focus.focusMinutes, Number(e.target.value))} />
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between"><p className="text-sm text-[var(--app-muted)]">Recent sessions</p><AlarmClock className="h-5 w-5 text-cyan-300" /></div>
          <div className="space-y-3">
            {focus.sessions.slice(0, 4).map((session) => (
              <div key={session.id} className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-3 text-sm text-[var(--app-muted)]">
                {session.minutes} min • {session.distractions} distractions
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
