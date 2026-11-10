# 👕 Outfit Recommender

A full-stack web app that picks an outfit from **your own wardrobe** based on the
**occasion** and the **current weather** in your city.

<!-- Screenshots will be added after deployment (Phase 4, step 4) -->

## Features

- **Outfit recommendations:** choose an occasion (casual, school, work, formal,
  sport) and a temperature, and get the best top + bottom + shoes combination
- **Live weather:** type a city to use its current temperature (Open-Meteo API)
- **Manage your wardrobe:** add and remove clothing items, with validation
  and clear error messages
- **Scoring algorithm:** filters clothes by occasion and temperature range, then
  scores every combination with color-matching rules
- **Tested:** unit tests for the recommendation algorithm (Vitest)

## Tech stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Frontend   | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Backend    | Next.js Route Handlers (REST API)                   |
| Database   | PostgreSQL + Prisma ORM                             |
| External API | [Open-Meteo](https://open-meteo.com/) (geocoding + weather, no API key) |
| Testing    | Vitest                                              |

## How it works

```
Browser (React)                       Server (Next.js Route Handlers)
───────────────                       ───────────────────────────────
Occasion + temperature  ──GET──▶  /api/outfits ──▶ PostgreSQL (Prisma)
                                       │
                                       └─▶ recommendOutfit(): filter → score → best
City name               ──GET──▶  /api/weather ──▶ Open-Meteo
Add / remove item       ──POST/DELETE──▶ /api/clothing ──▶ PostgreSQL
```

**The algorithm** (`lib/recommendOutfit.ts`):
1. **Filter:** keep items that match the occasion and whose `minTemp`–`maxTemp`
   range includes the temperature
2. **Group** into tops, bottoms, and shoes
3. **Score** every combination:
   - +1 if the top and bottom are different colors
   - +1 for black or brown shoes
   - −1 for brown shoes with black bottoms
4. **Return** the highest-scoring outfit, or `null` if no complete outfit fits

## API

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET`  | `/api/clothing` | List all clothing items |
| `POST` | `/api/clothing` | Add an item (validated; `400` with a message if invalid, `201` on success) |
| `DELETE` | `/api/clothing/:id` | Remove an item (`204`, or `404` if not found) |
| `GET`  | `/api/outfits?occasion=work&temperature=15` | Recommended outfit, or `null` |
| `GET`  | `/api/weather?city=London` | Current temperature (`404` unknown city, `502` if the weather service fails) |

Database failures return a JSON `500` with a generic message; details are only
logged on the server.

## Running it locally

**You need:** Node.js (developed with v26) and PostgreSQL (e.g. [Postgres.app](https://postgresapp.com/) on macOS).

```bash
git clone git@github.com:mtubat13356/outfit-recommender.git
cd outfit-recommender
npm install

# 1. Create a database called outfit_recommender, then set up your .env:
cp .env.example .env        # edit DATABASE_URL to match your setup

# 2. Create the tables and load sample clothes:
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# 3. Start the app at http://localhost:3000
npm run dev
```

**Run the tests:**

```bash
npm test
```

## Project structure

```
app/
  page.tsx                  Home page
  api/clothing/route.ts     GET + POST clothing
  api/clothing/[id]/route.ts  DELETE one item
  api/outfits/route.ts      Outfit recommendation
  api/weather/route.ts      City → current temperature
components/                 React components (controls, outfit card, wardrobe, form)
lib/
  recommendOutfit.ts        The recommendation algorithm
  recommendOutfit.test.ts   Its tests
  prisma.ts                 Shared database client
  serverError.ts            Consistent 500 responses
prisma/
  schema.prisma             Database model
  seed.ts                   Sample wardrobe loader
data/clothing.ts            ClothingItem type + sample data
```

## What I learned

<!-- ✏️ Write this section yourself, in your own words. -->
