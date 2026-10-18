# React + Vite

## Event discovery

After signing in, the app opens the Event Exploration workspace. Search, location, category filters, upcoming events, and event details are powered by the Ticketmaster Discovery API.

Create a `.env` file in the project root and add a Ticketmaster API key:

```bash
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

The key is used by the browser for this frontend demo, so use a key restricted to the local development origin. Ticket links open the official Ticketmaster listing in a new tab.

## Registrations

Select an event to register for it. Registered events are stored in Redux Toolkit and
persisted in the browser for the signed-in user. The **My Events** view separates
registrations into upcoming and completed events; upcoming registrations can be
cancelled from that view.

The Redux store uses the `auth` slice for accounts and sessions and the
`registrations` slice for event registrations. Registration actions and selectors
are shared by event discovery, event details, and My Events.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
