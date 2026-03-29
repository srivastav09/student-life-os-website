import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createJSONStorage } from 'zustand/middleware'
import { createSeedId, detectClash, deriveTaskStatus, type FocusSession, type Task, type TimetableClass } from '../lib/domain'
import { safeStorage } from '../lib/storage'
import { seedClasses, seedFocusSessions, seedTasks } from '../data/seed'

type FocusState = {
  isRunning: boolean
  phase: 'focus' | 'break'
  remainingSeconds: number
  focusMinutes: number
  breakMinutes: number
  distractionCount: number
  sessions: FocusSession[]
}

type AppState = {
  theme: 'dark' | 'light'
  tasks: Task[]
  classes: TimetableClass[]
  focus: FocusState
  toggleTheme: () => void
  addTask: (task: Omit<Task, 'id' | 'status'> & { status?: Task['status'] }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addClass: (entry: Omit<TimetableClass, 'id'>) => { ok: boolean; clash: boolean }
  deleteClass: (id: string) => void
  setFocusPreset: (focusMinutes: number, breakMinutes: number) => void
  startFocus: () => void
  pauseFocus: () => void
  resetFocus: () => void
  tickFocus: () => void
  addDistraction: () => void
}

export function createDefaultFocusState(): FocusState {
  return {
    isRunning: false,
    phase: 'focus',
    remainingSeconds: 25 * 60,
    focusMinutes: 25,
    breakMinutes: 5,
    distractionCount: 0,
    sessions: seedFocusSessions,
  }
}

const defaultFocus = createDefaultFocusState()

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      tasks: seedTasks,
      classes: seedClasses,
      focus: defaultFocus,
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            {
              id: createSeedId('task'),
              status: task.status ?? 'pending',
              ...task,
            },
            ...state.tasks,
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
              : { ...task, status: deriveTaskStatus(task) },
          ),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      addClass: (entry) => {
        const clash = detectClash(get().classes, entry)
        if (clash) return { ok: false, clash: true }

        set((state) => ({
          classes: [{ id: createSeedId('class'), ...entry }, ...state.classes],
        }))

        return { ok: true, clash: false }
      },
      deleteClass: (id) => set((state) => ({ classes: state.classes.filter((entry) => entry.id !== id) })),
      setFocusPreset: (focusMinutes, breakMinutes) =>
        set((state) => ({
          focus: {
            ...state.focus,
            focusMinutes,
            breakMinutes,
            remainingSeconds: focusMinutes * 60,
            isRunning: false,
            phase: 'focus',
          },
        })),
      startFocus: () => set((state) => ({ focus: { ...state.focus, isRunning: true } })),
      pauseFocus: () => set((state) => ({ focus: { ...state.focus, isRunning: false } })),
      resetFocus: () => set(() => ({ focus: { ...defaultFocus, sessions: get().focus.sessions } })),
      tickFocus: () => {
        const state = get()
        if (!state.focus.isRunning) return

        const nextRemaining = state.focus.remainingSeconds - 1
        if (nextRemaining > 0) {
          set((draft) => ({ focus: { ...draft.focus, remainingSeconds: nextRemaining } }))
          return
        }

        if (state.focus.phase === 'focus') {
          const session: FocusSession = {
            id: createSeedId('session'),
            startedAt: new Date(Date.now() - state.focus.focusMinutes * 60000).toISOString(),
            completedAt: new Date().toISOString(),
            minutes: state.focus.focusMinutes,
            distractions: state.focus.distractionCount,
          }

          set((draft) => ({
            focus: {
              ...draft.focus,
              phase: 'break',
              isRunning: true,
              remainingSeconds: draft.focus.breakMinutes * 60,
              distractionCount: 0,
              sessions: [session, ...draft.focus.sessions],
            },
          }))
          return
        }

        set((draft) => ({
          focus: {
            ...draft.focus,
            phase: 'focus',
            isRunning: false,
            remainingSeconds: draft.focus.focusMinutes * 60,
          },
        }))
      },
      addDistraction: () => set((state) => ({ focus: { ...state.focus, distractionCount: state.focus.distractionCount + 1 } })),
    }),
    {
      name: 'student-life-os',
      storage: createJSONStorage(() => safeStorage()),
      partialize: (state) => ({
        theme: state.theme,
        tasks: state.tasks,
        classes: state.classes,
        focus: state.focus,
      }),
    },
  ),
)
