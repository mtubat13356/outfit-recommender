import type { ClothingItem } from "@/data/clothing";

export type Outfit = {
  top: ClothingItem;
  bottom: ClothingItem;
  shoe: ClothingItem;
};

function scoreOutfit(top: ClothingItem, bottom: ClothingItem, shoe: ClothingItem): number {
  let score = 0;

  // Rule 1: top and bottom are different colors → +1
  if (top.color !== bottom.color) {
    score += 1;
  }

  // Rule 2: shoes are black or brown → +1
  if (shoe.color === "black" || shoe.color === "brown") {
    score += 1;
  }

  // Rule 3: brown shoes with black bottoms → -1
  if (shoe.color === "brown" && bottom.color === "black") {
    score -= 1;
  }

  return score;
}

export function recommendOutfit(
  clothing: ClothingItem[],
  occasion: string,
  temperature: number
) {
  // Part A: keep only items that fit the occasion AND the temperature
  const suitable = clothing.filter((item) =>
    item.occasions.includes(occasion) &&
    temperature >= item.minTemp &&
    temperature <= item.maxTemp
  );

  // Part B: split into the three categories
  const tops    = suitable.filter((item) => item.category === "top");
  const bottoms = suitable.filter((item) => item.category === "bottom");
  const shoes   = suitable.filter((item) => item.category === "shoes");

  // Part D: try every combination, keep the highest score
  let best: Outfit | null = null;
  let bestScore = -Infinity;

  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        const score = scoreOutfit(top, bottom, shoe);
        if (score > bestScore) {
          bestScore = score;
          best = { top, bottom, shoe };
        }
      }
    }
  }

  return best;
}
