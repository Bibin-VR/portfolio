# Bibin V R — Portfolio

**Personal portfolio site for a Robotics & AI Engineer.**

[Live site](https://app-seven-ebon.vercel.app)

A single-page React portfolio with a WebGL dithered background, a Three.js scene, and a
sound-reactive UI — built with performance and accessibility fallbacks in mind rather
than effects for their own sake.

## Sections

Loading screen → Hero → Stats → Projects → Skills → Experience → Contact, with a
persistent navigation bar. Each section triggers a chime on scroll-in, and background
ambience follows tab visibility (muted when the tab is hidden or the page is left).

## Stack

| Layer | Technology |
|---|---|
| Core | React 19 · TypeScript · Vite |
| 3D / shaders | Three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing |
| UI | Tailwind CSS · shadcn/ui (Radix primitives) |
| Forms | React Hook Form + resolvers |
| Contact backend | Express (`server.mjs`) + Nodemailer, deployable as a Vercel serverless function |

## Getting started

```bash
npm install
npm run dev          # Vite dev server only, http://localhost:5174
npm run dev-full      # Vite dev server + local email server together
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Frontend only |
| `npm run server` | Email server only (`node server.mjs`) |
| `npm run dev-full` | Both, concurrently |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | Lint with ESLint |
| `npm run preview` | Preview the production build |

## Contact form email setup

The contact form sends mail through Gmail via an app password. See
[`EMAIL_SETUP.md`](EMAIL_SETUP.md) for the full walkthrough; in short:

1. Enable 2-Step Verification on the sending Gmail account and generate an
   [App Password](https://myaccount.google.com/security).
2. Set `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`.
3. Run `npm run dev-full` — the frontend serves on `:5174`, the email server on `:3001`.

## Deployment

Deployed on Vercel. `api/send-email.mjs` and `api/github-stats.mjs` run as serverless
functions; the Vite build serves the static frontend.
