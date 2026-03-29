# AGENTS.md

## Project Rules

- Build only the frontend MVP for Student Life OS.
- Keep the app offline-first and browser-only.
- Do not add backend, auth, sync, or API dependencies unless explicitly requested.
- Preserve GitHub Pages compatibility for a project site.
- Use a relative Vite base (`./`) for GitHub Pages deployment.
- Default to dark mode and mobile-first layouts.
- Use motion for delight, but respect `prefers-reduced-motion`.

## Working Rules

- Prefer the smallest correct change.
- Keep feature logic close to the feature.
- Use `localStorage` for persistence.
- Add or update tests for behavior changes.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## Done When

- The UI works on mobile and desktop.
- Tests pass.
- Release build runs in GitHub Actions and deploys cleanly.
- GitHub Pages deployment config stays valid.
