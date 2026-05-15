# My Ideal Day

A web app for building **new daily habits** or **changing your life in a focused, short period of time** — because meaningful change does not have to take forever.

Plan your ideal day once, apply it to every day of the month, then track your progress one checkbox at a time.

## Features

- **Monthly calendar view** — compact mini-card grid with per-day progress indicators
- **Selected day detail** — full task list for the chosen day with inline add, check, and delete
- **Month plan** — add or edit a shared task template that applies to all days in a month
- **Custom tasks** — add one-off tasks to any individual day
- **Progress tracking** — animated circular progress per day card; turns green at 100 %
- **Habits** — define and track recurring personal habits
- **Feedback panel** — submit feedback and track its status with admin replies
- **Admin panel** — kanban board for managing user feedback (drag & drop, status, type tagging)
- **Settings** — appearance (light/dark mode) and language (EN/RU)
- **Responsive layout** — desktop two-column view; mobile horizontal-scroll card list

## Project structure

```
src/
├── app.tsx                          # Root — providers + router
├── infrastructure/
│   ├── context/                     # React context providers (auth, theme, locale, notifications)
│   ├── helpers/                     # Pure utility functions
│   ├── hooks/                       # Shared custom React hooks
│   ├── models/                      # Shared enums and domain types (e.g. FeedbackType)
│   └── storages/                    # Supabase data access helpers
├── components/
│   ├── admin-panel/                 # Admin kanban board and user management
│   ├── common/                      # Shared UI utilities and styles
│   ├── day/                         # DayCard, DayCardMini, progress ring
│   ├── day-list/                    # DayCardList + useDayCardList hook
│   ├── day-plan-panel/              # Edit/Add month plan drawer
│   ├── feedback/                    # User-facing feedback panel and items
│   ├── protected-route/             # Auth guard wrapper
│   ├── settings-panel/              # Appearance and language settings drawer
│   └── user-logo/
└── pages/
    ├── home-page/                   # Main page with the day grid
    ├── habit-page/                  # Habit tracking page
    ├── account-page/                # User account details
    ├── settings-page/
    ├── admin-page/
    ├── login-page/
    ├── signup-page/
    ├── auth-callback-page/
    └── not-found-page/
```

## Requirements

- [Node.js](https://nodejs.org/) (includes `npm`)
- A [Supabase](https://supabase.com/) project — run the SQL files in `supabase/migrations/` via the Supabase SQL editor

## Install

```bash
npm install
```

## Use

| Command | What it does |
|---|---|
| `npm start` | Starts the **development** server with hot reload at [http://localhost:3000](http://localhost:3000) |
| `npm run build:dev` | Unminified development bundle in `dist/` |
| `npm run build:prod` | Optimised production bundle in `dist/` |

## Stack

| Layer | Technology |
|---|---|
| UI framework | React 19, TypeScript |
| Component library | Fluent UI v9 (`@fluentui/react-components`) |
| Routing | React Router v7 |
| Backend / storage | Supabase (PostgreSQL + Auth) |
| Bundler | Webpack 5, Babel |
