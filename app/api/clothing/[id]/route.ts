import { prisma } from "@/lib/prisma";

// DELETE /api/clothing/grey-hoodie → removes that one item
// The folder name [id] means "any value here", given to us as params.id.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // deleteMany tells us how many rows it removed (0 or 1 here),
  // so we can reply 404 instead of crashing when the id doesn't exist.
  const result = await prisma.clothingItem.deleteMany({ where: { id } });
  if (result.count === 0) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  // 204 No Content: it worked, and there's nothing to send back
  return new Response(null, { status: 204 });
}
