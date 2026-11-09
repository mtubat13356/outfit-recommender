import { prisma } from "@/lib/prisma";

// GET /api/clothing → every clothing item in the database, as JSON
export async function GET() {
  const items = await prisma.clothingItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return Response.json(items);
}
