import type { Outfit } from "@/lib/recommendOutfit";

export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  const rows = [
    { emoji: "👕", label: "Top", item: outfit.top },
    { emoji: "👖", label: "Bottom", item: outfit.bottom },
    { emoji: "👟", label: "Shoes", item: outfit.shoe },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold">Your outfit</h2>
      <ul className="mt-3 space-y-2">
        {rows.map(({ emoji, label, item }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <span className="w-16 text-sm text-zinc-500">{label}</span>
            <span className="font-medium">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
