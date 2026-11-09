import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/serverError";
import type { ClothingItem } from "@/data/clothing";

// GET /api/clothing → every clothing item in the database, as JSON
export async function GET() {
  try {
    const items = await prisma.clothingItem.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return Response.json(items);
  } catch (error) {
    return serverError("GET /api/clothing", error);
  }
}

// What a valid POST body looks like: a ClothingItem without the id
// (the database generates it).
type ClothingInput = Omit<ClothingItem, "id">;

// A discriminated union: check `ok` and TypeScript knows which shape you have.
type ValidationResult =
  | { ok: false; error: string }
  | { ok: true; data: ClothingInput };

// Written by the user. `unknown` means "could be anything": TypeScript
// won't let us use a value until we've checked what it is.
function validateClothingInput(body: unknown): ValidationResult {
  const fail = (error: string): ValidationResult => ({ ok: false, error });

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail("Body must be a JSON object");
  }
  const { name, category, color, occasions, minTemp, maxTemp } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim() === "") return fail("name is required");

  if (category !== "top" && category !== "bottom" && category !== "shoes") {
    return fail("category must be top, bottom, or shoes");
  }

  if (typeof color !== "string" || color.trim() === "") return fail("color is required");

  if (!Array.isArray(occasions)) return fail("occasions must be an array");

  if (!occasions.every((o) => typeof o === "string")) return fail("every occasion must be a string");

  if (
    typeof minTemp !== "number" ||
    typeof maxTemp !== "number" ||
    !Number.isInteger(minTemp) ||
    !Number.isInteger(maxTemp)
  ) {
    return fail("minTemp and maxTemp must be whole numbers");
  }

  if (minTemp > maxTemp) return fail("minTemp cannot be greater than maxTemp");

  // Everything is checked, so TypeScript now knows each field's real type.
  // Only these fields are kept; anything extra in the body is dropped.
  return {
    ok: true,
    data: {
      name: name.trim(),
      category,
      color: color.trim().toLowerCase(),
      occasions,
      minTemp,
      maxTemp,
    },
  };
}

// POST /api/clothing → create one clothing item from a JSON body
export async function POST(request: Request) {
  // 1. Read the body. Invalid JSON makes request.json() throw.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  // 2. Validate. `result.ok` tells TypeScript which shape we have.
  const result = validateClothingInput(body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  // 3. Save. result.data is fully typed, with no `any` anywhere.
  try {
    const item = await prisma.clothingItem.create({ data: result.data });
    return Response.json(item, { status: 201 });
  } catch (error) {
    return serverError("POST /api/clothing", error);
  }
}
