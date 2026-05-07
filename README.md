# My Ideal Day

A web app for building **new daily habits** or **changing your life in a focused, short period of time** — because meaningful change does not have to take forever.

Plan your ideal day once, apply it to every day of the month, then track your progress one checkbox at a time.

## Features

- **Monthly calendar view** — compact mini-card grid with per-day progress indicators
- **Selected day detail** — full task list for the chosen day with inline add, check, and delete
- **Month plan** — add or edit a shared task template that applies to all days in a month
- **Custom tasks** — add one-off tasks to any individual day
- **Progress tracking** — animated circular progress per day card; turns green at 100 %
- **Feedback panel** — submit and review in-app feedback
- **Responsive layout** — desktop two-column view; mobile horizontal-scroll card list

## Project structure

```
src/
├── app.tsx                          # Root — providers + router
├── infrastructure/
│   ├── context/                     # Auth and theme React contexts
│   └── storages/                    # Supabase helpers (day-storage, feedback-storage)
├── components/
│   ├── day/                         # DayCard, DayCardMini, DayCardProgress, useDayCard
│   ├── day-list/                    # DayCardList, useDayCardList
│   ├── day-plan-panel/              # Edit/Add month plan drawer
│   ├── feedback/                    # Feedback panel and items
│   ├── header/                      # App header with dynamic actions
│   ├── page-layout/
│   └── common/                      # Shared styles and utilities
└── pages/
    ├── login-page/
    └── user-page/                   # Main page
```

## Requirements

- [Node.js](https://nodejs.org/) (includes `npm`)
- A [Supabase](https://supabase.com/) project with the required tables (tasks, feedback)

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
