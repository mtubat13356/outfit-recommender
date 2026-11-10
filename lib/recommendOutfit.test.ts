import { describe, expect, it } from "vitest";
import type { ClothingItem } from "@/data/clothing";
import { recommendOutfit } from "@/lib/recommendOutfit";

// Helper: builds a fake clothing item. Pass only the fields a test cares
// about; everything else gets a sensible default. We use small fake
// wardrobes instead of data/clothing.ts, so editing the sample data
// never breaks these tests.
function item(overrides: Partial<ClothingItem>): ClothingItem {
  return {
    id: overrides.name ?? "item",
    name: "Item",
    category: "top",
    color: "white",
    occasions: ["casual"],
    minTemp: 0,
    maxTemp: 30,
    ...overrides,
  };
}

describe("recommendOutfit", () => {
  it("returns one top, one bottom and one shoe when everything fits", () => {
    // Arrange: build the input
    const wardrobe = [
      item({ name: "Tee", category: "top" }),
      item({ name: "Jeans", category: "bottom", color: "blue" }),
      item({ name: "Boots", category: "shoes", color: "brown" }),
    ];

    // Act: run the code being tested
    const outfit = recommendOutfit(wardrobe, "casual", 20);

    // Assert: check the result
    expect(outfit).not.toBeNull();
    expect(outfit?.top.name).toBe("Tee");
    expect(outfit?.bottom.name).toBe("Jeans");
    expect(outfit?.shoe.name).toBe("Boots");
  });

  it("ignores clothes that are too warm or too cold for the temperature", () => {
    const wardrobe = [
      item({ name: "Winter Coat", category: "top", minTemp: -10, maxTemp: 5 }),
      item({ name: "Tee", category: "top", minTemp: 15, maxTemp: 35 }),
      item({ name: "Jeans", category: "bottom", color: "blue" }),
      item({ name: "Boots", category: "shoes", color: "brown" }),
    ];

    const outfit = recommendOutfit(wardrobe, "casual", 25);

    expect(outfit?.top.name).toBe("Tee"); // the coat is too warm for 25°C
  });

  // ✏️ Your tests go here
});
