import "dotenv/config";
import { prisma } from "../lib/prisma";
import { clothing } from "../data/clothing";

async function main() {
  // Start fresh so running the seed twice doesn't create duplicates
  await prisma.clothingItem.deleteMany();

  const result = await prisma.clothingItem.createMany({ data: clothing });
  console.log(`Seeded ${result.count} clothing items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
