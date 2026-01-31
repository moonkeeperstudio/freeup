# Tech Stack Recommendation for Freeup

**Freeup** is a web-based scheduling app that helps users find a meeting time across different time zones.

---

## Recommended Stack

### Frontend

- **React + Vite** — Fast to build with, great for the interactive calendar, time grid, and drag-to-adjust slots. Easy to align with your Figma screens.
- **Tailwind CSS** — Quick, consistent styling and simple responsive layout so you can match the "Planning Event" UI without fighting CSS.
- **shadcn/ui** (or Radix-based components) — Use for inputs, selects (location, time zone, date), buttons, and modals. Accessible and easy to customize to your design.

### Date, Time & Time Zones

- **Luxon** — Use this for all timezone logic: live conversion, "memory"/labels per zone, and overlap calculation. It's built for zones and works well in the browser.  
  Alternative: **date-fns** + **date-fns-tz** if you prefer that ecosystem.

### Calendar & Time-Slot UI

- **Custom React components** — For "choose time slot" and "drag time slot to preferred time range," a custom grid (e.g. days × hours, one row or column per time zone) gives you full control over overlap highlighting and drag behavior.
- **@dnd-kit** — Use for drag-and-drop of time blocks (e.g. "drag slot to preferred time range"). Lightweight and works well with React.

### Backend & Data

- **Supabase** — Fits a 48h timeline: Postgres for events and share links, optional Auth for "memory"/labels and user-defined blocks, and optional Realtime if you add live collaboration later.
- **Alternative** — **Next.js** with API routes + **Vercel** + Supabase (or Vercel Postgres/KV) if you want one repo and one deploy for frontend + API.

### Hosting & Deployment

- **Vercel** — Simple deploy for either a Vite SPA or a Next.js app, with env support for Supabase.

---

## Summary Table

| Layer       | Choice                 | Why                                  |
| ----------- | ---------------------- | ------------------------------------ |
| Framework   | React + Vite           | Speed, interactivity, Figma-friendly |
| Styling     | Tailwind + shadcn/ui   | Fast UI that matches your design     |
| Date/Time   | Luxon                  | Reliable timezone and overlap logic  |
| Calendar UI | Custom grid + @dnd-kit | Multi-timezone view + drag slots     |
| Backend     | Supabase               | Quick auth + DB + optional realtime  |
| Deploy      | Vercel                 | One-click, good DX for hackathon     |

---

## Fit With Your Flow & Brainstorm

- **Live conversion & overlap** → Luxon in the frontend; overlap logic as a small module that takes "availability windows" per participant and returns suggested slots.
- **Memory/labels for time zones** → Stored in Supabase (e.g. user prefs or per-event) and applied when rendering the grid.
- **User-defined unavailable blocks & weekends** → Same Supabase model (or local state first); used as input to the overlap algorithm.
- **Small calendar for dates** → A date picker from shadcn/ui (or similar) plus your custom time grid for the chosen day(s).
- **Share link** → Backend generates a short/slug link and stores event + availability in Supabase; landing page reads from URL and restores state.

---

_Generated for the Freeup project._
