# My Ideal Day — Claude Code Guide

## Project overview
A React app for planning and tracking daily tasks, organized by day cards in a monthly view.

## Tech stack
- React 19, TypeScript
- Fluent UI (`@fluentui/react-components`) for all UI components and styling (makeStyles/mergeClasses)
- React Router v7 for routing
- Webpack + Babel for bundling
- No test framework currently

## Dev commands
```bash
npm start          # dev server (webpack serve)
npm run build:dev  # development build
npm run build:prod # production build
```

## Project structure
```
src/
  app.tsx                        # root — providers + router
  infrastructure/
    context/                     # React context providers (auth, theme)
    storages/                    # localStorage helpers (e.g. day-storage.ts)
  components/
    day/                         # DayCard component + styles
    day-list/                    # DayCardList + useDayCardList hook
    header/
    page-layout/
    user-logo/
  pages/
    login-page/
    user-page/                   # main page with the day grid
```

## Conventions
- Styles: Fluent UI `makeStyles` / `mergeClasses` — no plain CSS modules or inline styles
- File naming: kebab-case for files, PascalCase for components/interfaces
- Each component folder has an `index.ts` barrel export
- Context providers live in `src/infrastructure/context/`
- Storage helpers live in `src/infrastructure/storages/`

## Rule
