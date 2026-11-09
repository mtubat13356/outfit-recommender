"use client";

import { useState } from "react";
import { clothing } from "@/data/clothing";
import { recommendOutfit } from "@/lib/recommendOutfit";
import OutfitCard from "@/components/OutfitCard";

const OCCASIONS = ["casual", "school", "work", "formal", "sport"];

export default function OutfitControls() {
  const [occasion, setOccasion] = useState("casual");
  const [temperature, setTemperature] = useState(20);

  // Derived value: recalculated on every render, no extra state needed
  const outfit = recommendOutfit(clothing, occasion, temperature);

  return (
    <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <label className="block">
        <span className="text-sm font-medium">Occasion</span>
        <select
          value={occasion}
          onChange={(event) => setOccasion(event.target.value)}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        >
          {OCCASIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-6 block">
        <span className="text-sm font-medium">Temperature: {temperature}°C</span>
        <input
          type="range"
          min={-10}
          max={40}
          value={temperature}
          onChange={(event) => setTemperature(Number(event.target.value))}
          className="mt-2 block w-full"
        />
      </label>

      <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        You picked: <strong>{occasion}</strong>, <strong>{temperature}°C</strong>
      </p>

      <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {outfit === null ? <p>No outfit matches these conditions.</p> : <OutfitCard outfit={outfit} />}
      </div>
    </section>
  );
}
