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
- [x] Phase 2, step 2: Prisma 7.10.1 (pinned; npm "latest" is an 8.0 RC, avoid).
  Config is `prisma7.config.ts` (generated name), schema `prisma/schema.prisma`,
  client output `generated/prisma` (gitignored), `@prisma/adapter-pg` installed.
  User wrote `Category` enum + `ClothingItem` model. No migration run yet.
- [x] Phase 2, step 3: migration `init` applied (table + enum). `npx prisma generate`
  must be run after schema changes (not automatic in Prisma 7). Shared client in
  `lib/prisma.ts` (PrismaPg adapter, globalThis singleton). Seed: `npx prisma db seed`
  runs `tsx prisma/seed.ts` (deleteMany + createMany from data/clothing.ts).
- [x] Phase 2, step 4: `app/api/clothing/route.ts` GET → `findMany` ordered by
  category, name. DB query makes it run per request (Cache Components on).
  Tested by calling GET() via tsx (`--env-file=.env --tsconfig tsconfig.json`,
  `.mts` for top-level await) to avoid dev-server cache while disk is low.
- [x] Phase 2, step 5: `POST /api/clothing` in the same route.ts. User wrote
  `validateClothingInput` (returns error string or null). Route: bad JSON / non-object
  → 400, validation error → 400 `{ error }`, else `create` with whitelisted fields
  (trimmed, color lowercased) → 201. Tested via tsx; reseed after tests.
- [x] Phase 2, step 6: `app/api/outfits/route.ts` GET `?occasion=&temperature=`
  (NextRequest `nextUrl.searchParams`; text → Number, NaN/missing → 400). Loads all
  items from DB, runs the user's `recommendOutfit` unchanged, returns outfit or null.
  tsx tests outside the project must import next via full node_modules path.
- [x] Phase 2, step 7: `OutfitControls` fetches `/api/outfits` in `useEffect`
  (deps occasion+temperature; `ignore` flag in cleanup prevents stale replies;
  outfit/loading/error state). data/clothing.ts now only used by seed + type.
  **Phase 2 complete.**
- [x] Phase 3, step 1: `app/api/weather/route.ts` GET `?city=` → Open-Meteo geocoding
  then forecast (`current=temperature_2m`), no API key, 5 s timeouts. Unknown city
  (no `results` key) → 404, upstream failure → 502. User wrote the JSON-digging lines.
  `OutfitControls` has a city form; result is clamped to -10..40 and sets the slider.
- [x] Phase 3, step 2a: `app/api/clothing/[id]/route.ts` DELETE (`params` is a Promise;
  deleteMany count 0 → 404, else 204). `components/Wardrobe.tsx` lists items with ✕.
  `components/OutfitApp.tsx` (client parent) owns `wardrobeVersion`, passed to both
  Wardrobe and OutfitControls (in its effect deps) so deletes refresh the outfit.
  Run `npx eslint .` before committing. Reseed restores deleted sample items.
- [x] Phase 3, step 2b: `components/AddItemForm.tsx` (inside Wardrobe, `onAdded={onChange}`).
  User wrote `toggleOccasion` (immutable add/remove). Number boxes kept as text,
  empty → null so the server rejects it. Shows server 400 messages.
- [ ] Phase 3, step 3: error handling (incl. `any` → `unknown` in clothing route) · step 4: tests
- Disk space: ~9 GB free after cleanup (Nov 2026); still watch big installs.
