import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5 shadow-2xl shadow-black/40">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--app-fg)]">{title}</h2>
          <GhostButton onClick={onClose} type="button">Close</GhostButton>
        </div>
        {children}
      </div>
    </div>
  )
}
