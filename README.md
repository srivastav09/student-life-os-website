# Student Life OS

Frontend-only, offline-first student productivity app for tasks, timetable, and focus sessions.

## Stack

- React + TypeScript + Vite
- Zustand + localStorage
- Tailwind CSS
- Framer Motion

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

## GitHub Pages

This repo is configured as a project site.

- Vite `base` is set to `./` for GitHub Pages project deployment
- Deployment uses GitHub Actions from `.github/workflows/deploy.yml`
- In GitHub, set `Settings > Pages > Source = GitHub Actions`
- Release builds happen in GitHub Actions before deploy

## Notes

- The app is offline-first and browser-only.
- Data persists locally in `localStorage`.
- Motion respects reduced-motion preferences.
