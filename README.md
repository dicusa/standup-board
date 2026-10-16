# Standup Board

A responsive, browser-only shell for sharing a team's daily standup. The shell includes today’s board, update and blockers views, accessible shared controls, and typed daily update models. Browser storage access starts with a readable loading state and reports errors with a retry action.

## Run locally

```sh
npm install
npm run dev
```

## Build and test

```sh
npm run build
npm test
```

Standup data is read from the browser's `localStorage` under `standup-board-updates`. The initial shell shows saved board data when available; posting and resolving updates are not implemented in this project shell.

## Prerequisites

Install Node.js (20 or newer) and npm. From the project directory run:

```sh
npm install
npm run dev
```

Vite prints the local URL to open in your browser. Build with `npm run build` and run the Vitest suite with `npm test` (or `npm run test:watch` for watch mode). On first use, enter a name, post an update, then use Blockers to mark an item resolved. Data is stored in this browser's localStorage.
