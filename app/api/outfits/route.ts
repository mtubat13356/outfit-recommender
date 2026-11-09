import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { recommendOutfit } from "@/lib/recommendOutfit";

// GET /api/outfits?occasion=casual&temperature=20 → the best outfit, or null
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const occasion = searchParams.get("occasion"); // string, or null if missing
  const temperatureText = searchParams.get("temperature");

  if (occasion === null || occasion.trim() === "") {
    return Response.json({ error: "occasion is required" }, { status: 400 });
  }

  // Query params are always text, so convert. Number("abc") gives NaN.
  const temperature = Number(temperatureText);
  if (temperatureText === null || temperatureText.trim() === "" || !Number.isFinite(temperature)) {
    return Response.json({ error: "temperature must be a number" }, { status: 400 });
  }

  const clothing = await prisma.clothingItem.findMany();
  const outfit = recommendOutfit(clothing, occasion, temperature);

  return Response.json(outfit);
}
