# Student Life OS

Modern, responsive student life website for tasks, timetable, focus, notes, login, and daily planning.

## Stack

- HTML, CSS, JavaScript
- Vite frontend
- Node backend with file-based persistence
- Optional OpenAI API for AI coach

## Scripts

- `npm run dev`
- `npm run api`
- `npm run build`
- `npm run lint`
- `npm run test`

## GitHub Pages

This repo is configured as a project site.

- Vite `base` is set to `./` for GitHub Pages project deployment
- Data persists locally in `localStorage`
- Motion respects reduced-motion preferences
- Run the backend with `npm run api`
- Set `OPENAI_API_KEY` to enable AI suggestions
