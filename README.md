# Standup Board

A responsive, browser-only team standup board. Your name and daily updates are saved in this browser's local storage; there are no accounts or server.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use **Post an update** to share yesterday's work, today's plan, and an optional blocker. Updates appear on today's board; open blockers can be marked resolved. Data remains in the current browser profile.

## Build and test

```sh
npm test
npm run build
```

`npm run preview` serves the production build locally.
