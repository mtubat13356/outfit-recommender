@AGENTS.md

# Outfit Recommendation Platform

A full-stack app that recommends outfits based on weather, occasion, and the
clothes in the user's wardrobe. Built by a student preparing for SWE
internships, so **learning is the main goal**, not just working code.

Stack: Next.js (App Router) + TypeScript + Tailwind. Later: PostgreSQL + Prisma,
a weather API, AWS deployment.

## Working rules (follow these every session)

- The user wants to **fully understand** the project, not just have it built.
- Work in **small steps**. Before writing code, explain in plain language what
  we're about to build and why.
- After each step, explain the key concepts involved (e.g. what a Route Handler
  is, why something is typed a certain way), then **stop and wait** for the user
  before moving on.
- **Recommendation algorithm (`lib/recommendOutfit.ts`): do NOT write it for
  the user.** Let them write it first; give hints and feedback, and only
  reveal more of the answer when they ask.
- Occasionally ask a quick question to check understanding.
- **Commit and push to GitHub at the end of each completed step**
  (remote `origin` = git@github.com:mtubat13356/outfit-recommender.git, branch
  `main`, SSH auth). Briefly explain the git commands used. Never commit `.env`.

## Plan

### Phase 1 – Frontend + algorithm (local data only, no database yet)
1. Set up Next.js + Tailwind
2. Sample wardrobe data in `data/clothing.ts` using this type:
   `{ id, name, category: "top" | "bottom" | "shoes", color, occasions: string[], minTemp, maxTemp }`
3. Occasion and temperature selectors
4. Algorithm in `lib/recommendOutfit.ts`: filter by occasion + temperature, then
   score top/bottom/shoe combinations with simple color rules (user writes it)
5. Display the generated outfit

### Phase 2 – Database + API
PostgreSQL + Prisma, `ClothingItem` model, GET/POST clothing endpoints, outfit
recommendation endpoint, connect frontend to API.

### Phase 3 – Real features
Weather API, add/remove clothing, error handling, tests.

### Phase 4 – Ship it
GitHub, AWS hosting, production database, README with screenshots.

## Progress
- [x] Phase 1, step 1: Next.js + Tailwind scaffolded (Next 16, React 19, Tailwind v4).
  `npm run build` passes. Node 26 is installed via nvm (default alias). An old
  system Node 20.15 still exists at /usr/local/bin/node and breaks Tailwind; in
  scripted shells, run `. ~/.nvm/nvm.sh && nvm use 26` first. If the build fails
  with `require() of ES Module`, delete `.next/` (stale cache) and rebuild.
- [x] Phase 1, step 2: `data/clothing.ts`. The user wrote the `ClothingItem` type
  themselves; 15 sample items (5 tops, 5 bottoms, 5 shoes). Occasions used:
  casual, school, work, formal, sport. Colors are simple lowercase words.
- [x] Phase 1, step 3: `components/OutfitControls.tsx` (Client Component, useState
  for occasion + temperature, dropdown + slider -10..40). `app/page.tsx` renders it.
- [x] Phase 1, step 4: `lib/recommendOutfit.ts` written by the user via hints:
  filter → group → `scoreOutfit` (their 3 color rules) → nested loops keep best
  (ties: first found wins). Returns `{ top, bottom, shoe }` or `null`.
- [x] Phase 1, step 5: `components/OutfitCard.tsx` shows an `Outfit`; `OutfitControls`
  derives `outfit` from state (no extra useState). User wrote the null check.
  `Outfit` type exported from `lib/recommendOutfit.ts`. **Phase 1 complete.**
- [x] Phase 2, step 1: PostgreSQL 18 via Postgres.app (must be open/running).
  Local DB `outfit_recommender`, user `medhatubati`, no password, port 5432.
  CLI tools at /Applications/Postgres.app/Contents/Versions/latest/bin (not on PATH).
- [ ] Phase 2, step 2: Prisma setup + `ClothingItem` model
