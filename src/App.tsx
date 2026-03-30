import { useEffect, useRef } from 'react'

const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Responsive Design']

const projects = [
  {
    title: 'Creative Landing Page',
    description: 'A clean hero section, feature highlights, and strong calls to action for a product or service.',
  },
  {
    title: 'Personal Blog',
    description: 'A simple content-driven layout with readable typography and a focus on storytelling.',
  },
  {
    title: 'Portfolio Dashboard',
    description: 'A project showcase with cards, skill tags, and contact details that works well on mobile.',
  },
]

export default function App() {
  const trailRefs = useRef<Array<{ x: number; y: number }>>([
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 },
  ])

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')

    if (reducedMotion?.matches) return

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.35
    let rafId = 0

    const trailPositions = trailRefs.current

    const setCursorPosition = (x: number, y: number) => {
      root.style.setProperty('--cursor-x', `${x}px`)
      root.style.setProperty('--cursor-y', `${y}px`)
    }

    const setCursorShape = (dx: number, dy: number) => {
      const distance = Math.hypot(dx, dy)
      const stretch = Math.min(distance / 90, 1)
      const rotate = Math.atan2(dy, dx) * (180 / Math.PI)

      root.style.setProperty('--cursor-rotate', `${rotate}deg`)
      root.style.setProperty('--cursor-scale-x', `${1 + stretch}`)
      root.style.setProperty('--cursor-scale-y', `${Math.max(0.55, 1 - stretch * 0.45)}`)
    }

    setCursorPosition(window.innerWidth * 0.5, window.innerHeight * 0.35)
    root.style.setProperty('--cursor-rotate', '0deg')
    root.style.setProperty('--cursor-scale-x', '1')
    root.style.setProperty('--cursor-scale-y', '1')

    const handlePointerMove = (event: PointerEvent) => {
      const dx = event.clientX - targetX
      const dy = event.clientY - targetY

      targetX = event.clientX
      targetY = event.clientY

      setCursorPosition(targetX, targetY)
      setCursorShape(dx, dy)
    }

    const animate = () => {
      trailPositions[0].x += (targetX - trailPositions[0].x) * 0.38
      trailPositions[0].y += (targetY - trailPositions[0].y) * 0.38
      trailPositions[1].x += (trailPositions[0].x - trailPositions[1].x) * 0.26
      trailPositions[1].y += (trailPositions[0].y - trailPositions[1].y) * 0.26
      trailPositions[2].x += (trailPositions[1].x - trailPositions[2].x) * 0.18
      trailPositions[2].y += (trailPositions[1].y - trailPositions[2].y) * 0.18

      trailPositions.forEach((point, index) => {
        root.style.setProperty(`--cursor-trail-${index + 1}-x`, `${point.x}px`)
        root.style.setProperty(`--cursor-trail-${index + 1}-y`, `${point.y}px`)
      })

      rafId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove)
    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.cancelAnimationFrame(rafId)
      root.style.removeProperty('--cursor-x')
      root.style.removeProperty('--cursor-y')
      root.style.removeProperty('--cursor-rotate')
      root.style.removeProperty('--cursor-scale-x')
      root.style.removeProperty('--cursor-scale-y')
      root.style.removeProperty('--cursor-trail-1-x')
      root.style.removeProperty('--cursor-trail-1-y')
      root.style.removeProperty('--cursor-trail-2-x')
      root.style.removeProperty('--cursor-trail-2-y')
      root.style.removeProperty('--cursor-trail-3-x')
      root.style.removeProperty('--cursor-trail-3-y')
    }
  }, [])

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)] text-slate-100">
      <div aria-hidden="true" className="liquid-cursor" />
      <div aria-hidden="true" className="liquid-cursor liquid-cursor--trail liquid-cursor--trail-1" />
      <div aria-hidden="true" className="liquid-cursor liquid-cursor--trail liquid-cursor--trail-2" />
      <div aria-hidden="true" className="liquid-cursor liquid-cursor--trail liquid-cursor--trail-3" />
      <div className="relative z-10">
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Portfolio Website
            </p>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Hi, I&apos;m <span className="text-cyan-300">Your Name</span>.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                I design and build simple, modern websites with HTML and CSS. I focus on clean layouts,
                readable content, and responsive experiences that work on every screen size.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="rounded-full border border-slate-700 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10"
              >
                Contact Me
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur">
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">About Me</p>
              <h2 className="text-2xl font-bold text-white">Frontend Developer</h2>
              <p className="text-sm leading-6 text-slate-300">
                I help turn ideas into polished websites with a strong visual identity and smooth user
                flow.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-cyan-300">12+</div>
                  <div className="text-slate-400">Projects</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-cyan-300">3</div>
                  <div className="text-slate-400">Skills</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-lg font-bold text-cyan-300">100%</div>
                  <div className="text-slate-400">Responsive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">About</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Simple, clear, and effective.</h2>
          </div>
          <div className="md:col-span-2">
            <p className="max-w-3xl text-base leading-7 text-slate-300">
              This portfolio is built as a clean one-page site with a strong hero section, project
              cards, skill tags, and a contact area. It is easy to customize with your own name,
              projects, and links.
            </p>
          </div>
        </div>
      </section>

        <section id="projects" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Projects</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Selected Work</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6">
              <div className="mb-4 h-40 rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(34,211,238,0.22),rgba(99,102,241,0.18))]" />
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Skills</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Built with core web technologies</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

        <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-6 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 text-center sm:p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Contact</p>
          <h2 className="mt-3 text-3xl font-bold text-white">Let&apos;s build something together.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Email me at <a className="text-cyan-300 hover:text-cyan-200" href="mailto:you@example.com">you@example.com</a> or connect on social media.
          </p>
        </div>
      </section>
      </div>
    </main>
  )
}
