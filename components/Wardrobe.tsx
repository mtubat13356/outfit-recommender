"use client";

import { useEffect, useState } from "react";
import type { ClothingItem } from "@/data/clothing";
import AddItemForm from "@/components/AddItemForm";

type Props = {
  wardrobeVersion: number; // goes up whenever the wardrobe changes
  onChange: () => void; // call this after we change the wardrobe
};

const SECTIONS = [
  { category: "top", title: "👕 Tops" },
  { category: "bottom", title: "👖 Bottoms" },
  { category: "shoes", title: "👟 Shoes" },
] as const;

export default function Wardrobe({ wardrobeVersion, onChange }: Props) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load the list on first render, and again whenever wardrobeVersion changes
  useEffect(() => {
    let ignore = false;
    fetch("/api/clothing")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: ClothingItem[]) => {
        if (!ignore) {
          setItems(data);
          setError(null);
        }
      })
      .catch(() => {
        if (!ignore) setError("Couldn't load your wardrobe.");
      });
    return () => {
      ignore = true;
    };
  }, [wardrobeVersion]);

  async function removeItem(item: ClothingItem) {
    if (!confirm(`Remove "${item.name}" from your wardrobe?`)) return;
    const res = await fetch(`/api/clothing/${encodeURIComponent(item.id)}`, { method: "DELETE" });
    if (!res.ok) {
      setError(`Couldn't remove ${item.name}.`);
      return;
    }
    onChange(); // tell the parent: the wardrobe changed
  }

  return (
    <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">My wardrobe ({items.length})</h2>
      {error !== null && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {SECTIONS.map(({ category, title }) => (
        <div key={category} className="mt-4">
          <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
          <ul className="mt-1 divide-y divide-zinc-100 dark:divide-zinc-800">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between py-1.5">
                  <span>
                    {item.name}{" "}
                    <span className="text-xs text-zinc-500">
                      {item.minTemp}–{item.maxTemp}°C · {item.occasions.join(", ")}
                    </span>
                  </span>
                  <button
                    onClick={() => removeItem(item)}
                    aria-label={`Remove ${item.name}`}
                    className="rounded px-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  >
                    ✕
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}

      <AddItemForm onAdded={onChange} />
    </section>
  );
}
