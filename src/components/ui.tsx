import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/utils'

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50',
        'bg-[var(--app-accent)] text-[var(--app-accent-fg)] shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-[0.99]',
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export const GhostButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2 text-sm font-semibold text-[var(--app-fg)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
        className,
      )}
      {...props}
    />
  ),
)
GhostButton.displayName = 'GhostButton'

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-2xl shadow-black/20 backdrop-blur', props.className)} />
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn('w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-sm text-[var(--app-fg)] outline-none placeholder:text-[var(--app-muted)] focus:border-cyan-400/60', props.className)} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn('w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-sm text-[var(--app-fg)] outline-none placeholder:text-[var(--app-muted)] focus:border-cyan-400/60', props.className)} />
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('mb-2 block text-sm font-medium text-[var(--app-fg)]', props.className)} />
}

export function Badge(props: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cn('inline-flex items-center rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--app-muted)]', props.className)} />
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center px-4" role="dialog" aria-modal="true">
          <motion.button
            aria-label="Close dialog"
            className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            type="button"
          />
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-xl rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-2xl shadow-black/40"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--app-fg)]">{title}</h2>
              <GhostButton onClick={onClose} type="button">Close</GhostButton>
            </div>
            <motion.div
              initial={reduced ? false : 'hidden'}
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
