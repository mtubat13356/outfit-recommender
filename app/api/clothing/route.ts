/* eslint-disable @typescript-eslint/no-explicit-any --
   The request body is untrusted, so we check it by hand at runtime.
   TODO (Phase 3, step 3): replace `any` with `unknown` for stricter checks. */
import { prisma } from "@/lib/prisma";

// GET /api/clothing → every clothing item in the database, as JSON
export async function GET() {
  const items = await prisma.clothingItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return Response.json(items);
}

// Written by the user: returns an error message, or null if the body is valid.
function validateClothingInput(body: any): string | null {
  if (typeof body.name !== "string" || body.name.trim() === "") {
    return "name is required";
  }

  if (!["top", "bottom", "shoes"].includes(body.category)) {
    return "category must be top, bottom, or shoes";
  }

  if (typeof body.color !== "string" || body.color.trim() === "") {
    return "color is required";
  }

  if (!Array.isArray(body.occasions)) {
    return "occasions must be an array";
  }

  if (!body.occasions.every((o: any) => typeof o === "string")) {
    return "every occasion must be a string";
  }

  if (!Number.isInteger(body.minTemp) || !Number.isInteger(body.maxTemp)) {
    return "minTemp and maxTemp must be whole numbers";
  }

  if (body.minTemp > body.maxTemp) {
    return "minTemp cannot be greater than maxTemp";
  }

  return null;
}

// POST /api/clothing → create one clothing item from a JSON body
export async function POST(request: Request) {
  // 1. Read the body. Invalid JSON makes request.json() throw.
  let body: any;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  // 2. The body must be an object (not null, a number, or an array)
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  // 3. Validate every field
  const error = validateClothingInput(body);
  if (error !== null) {
    return Response.json({ error }, { status: 400 });
  }

  // 4. Save only the fields we expect. The database generates the id.
  const item = await prisma.clothingItem.create({
    data: {
      name: body.name.trim(),
      category: body.category,
      color: body.color.trim().toLowerCase(),
      occasions: body.occasions,
      minTemp: body.minTemp,
      maxTemp: body.maxTemp,
    },
  });

  return Response.json(item, { status: 201 });
}
