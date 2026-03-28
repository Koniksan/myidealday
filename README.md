# My Ideal Day

A web app for building **new daily habits** or **changing your life in a focused, short period of time** — because meaningful change does not have to take forever.

## Project structure

```
myidealday/
├── src/
│   ├── app.tsx       # React application entry
│   └── index.html    # HTML template (used by webpack)
├── webpack.config.js # Bundler and dev-server settings
├── package.json
└── dist/             # Build output (created by `npm run build:*`; contents gitignored)
```

## Requirements

- [Node.js](https://nodejs.org/) (includes `npm`)

## Install

From the project root:

```bash
npm install
```

## Use

| Command | What it does |
|--------|----------------|
| `npm start` | Starts the **development** server with hot reload. Default URL: [http://localhost:3000](http://localhost:3000) (browser may open automatically). |
| `npm run build:dev` | Creates an unminified bundle in `dist/` (development mode). |
| `npm run build:prod` | Creates an optimized production bundle in `dist/` (hashed filenames, source maps). |

To preview a **production** build locally, run `npm run build:prod` and serve the `dist/` folder with any static file server, or open `dist/index.html` in a browser if your setup allows it.

## Stack

React 19, TypeScript/TSX, Webpack 5, Babel.
