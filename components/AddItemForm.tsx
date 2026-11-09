"use client";

import { useState } from "react";

const OCCASIONS = ["casual", "school", "work", "formal", "sport"];

// Written by the user: returns a NEW array with `occasion` added or removed
function toggleOccasion(occasions: string[], occasion: string): string[] {
  if (occasions.includes(occasion)) {
    return occasions.filter((o) => o !== occasion); // remove it
  }
  return [...occasions, occasion]; // add it
}

// Number("") is 0, not NaN, so an empty box becomes null instead.
// The server then rejects it with "minTemp and maxTemp must be whole numbers".
function toNumberOrNull(text: string): number | null {
  return text.trim() === "" ? null : Number(text);
}

const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700";

export default function AddItemForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("top");
  const [color, setColor] = useState("");
  const [occasions, setOccasions] = useState<string[]>([]);
  // Number boxes are kept as text while typing, then converted on submit
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/clothing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          color,
          occasions,
          minTemp: toNumberOrNull(minTemp),
          maxTemp: toNumberOrNull(maxTemp),
        }),
      });
      if (!res.ok) {
        // Show the server's message, e.g. from validateClothingInput
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't add the item.");
        return;
      }
      // 201 Created: clear the form and tell the parent the wardrobe changed
      setName("");
      setColor("");
      setOccasions([]);
      setMinTemp("");
      setMaxTemp("");
      onAdded();
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <h3 className="font-semibold">Add an item</h3>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="col-span-2 block text-sm">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Green Jacket" className={inputClass} />
        </label>
        <label className="block text-sm">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="top">top</option>
            <option value="bottom">bottom</option>
            <option value="shoes">shoes</option>
          </select>
        </label>
        <label className="block text-sm">
          Color
          <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. green" className={inputClass} />
        </label>
        <label className="block text-sm">
          Min °C
          <input type="number" step={1} value={minTemp} onChange={(e) => setMinTemp(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm">
          Max °C
          <input type="number" step={1} value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} className={inputClass} />
        </label>
      </div>

      <fieldset className="mt-3">
        <legend className="text-sm">Occasions</legend>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {OCCASIONS.map((o) => (
            <label key={o} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={occasions.includes(o)}
                onChange={() => setOccasions(toggleOccasion(occasions, o))}
              />
              {o}
            </label>
          ))}
        </div>
      </fieldset>

      {error !== null && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {saving ? "Adding…" : "Add item"}
      </button>
    </form>
  );
}
