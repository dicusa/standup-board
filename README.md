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
