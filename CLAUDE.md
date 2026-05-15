# My Ideal Day — Claude Code Guide

## Project overview
A React app for planning and tracking daily tasks, organized by day cards in a monthly view.

## Tech stack
- React 19, TypeScript
- Fluent UI (`@fluentui/react-components`) for all UI components and styling (makeStyles/mergeClasses)
- React Router v7 for routing
- Webpack + Babel for bundling
- No test framework currently

## Project structure
```
src/
  app.tsx                        # root — providers + router
  infrastructure/
    context/                     # React context providers (auth, theme, locale, notifications)
    helpers/                     # Pure utility functions
    hooks/                       # Shared custom React hooks
    models/                      # Shared enums and domain types (e.g. FeedbackType)
    storages/                    # Supabase data access helpers
  components/
    admin-panel/                 # Admin kanban board and user management
    common/                      # Shared UI utilities and styles
    day/                         # DayCard component + styles
    day-list/                    # DayCardList + useDayCardList hook
    day-plan-panel/              # Edit/Add month plan drawer
    feedback/                    # User-facing feedback panel and items
    protected-route/             # Auth guard wrapper
    settings-panel/              # Appearance and language settings drawer
    user-logo/
  pages/
    home-page/                   # Main page with the day grid
    habit-page/                  # Habit tracking page
    account-page/
    settings-page/
    admin-page/
    login-page/
    signup-page/
    auth-callback-page/
    not-found-page/
```

## Conventions
- Styles: Fluent UI `makeStyles` / `mergeClasses` — no plain CSS modules or inline styles
- All colors used only from Fluent UI library (tokens)
- File naming: kebab-case for files, PascalCase for components/interfaces
- Each component folder has an `index.ts` barrel export
- Context providers live in `src/infrastructure/context/`
- Storage live in `src/infrastructure/storages/`
- Helpers live in `src/infrastructure/helpers`
- Models live in `src/infrastructure/models/`

## Rule
 - For each iteration like: map, forEach, reduce, filter, find end etc. use `x,y,z` method. Example arr.map(x => x.filter(y => y.find(z => z != null)))
