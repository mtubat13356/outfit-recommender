"use client";

import { useEffect, useState } from "react";
import type { Outfit } from "@/lib/recommendOutfit";
import OutfitCard from "@/components/OutfitCard";

const OCCASIONS = ["casual", "school", "work", "formal", "sport"];

export default function OutfitControls() {
  const [occasion, setOccasion] = useState("casual");
  const [temperature, setTemperature] = useState(20);

  // The outfit now comes from the server, so it arrives later and lives in state
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Runs after render, and again whenever occasion or temperature changes
  useEffect(() => {
    // If the user changes inputs before this request finishes, the cleanup
    // below sets ignore = true, so an old (stale) reply can't overwrite a newer one.
    let ignore = false;

    async function loadOutfit() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ occasion, temperature: String(temperature) });
        const res = await fetch(`/api/outfits?${params}`);
        if (!res.ok) throw new Error(`Server replied ${res.status}`);
        const data: Outfit | null = await res.json();
        if (!ignore) setOutfit(data);
      } catch {
        if (!ignore) setError("Couldn't load an outfit. Is the database running?");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadOutfit();
    return () => {
      ignore = true;
    };
  }, [occasion, temperature]);

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
        {error !== null ? (
          <p className="text-red-600">{error}</p>
        ) : loading && outfit === null ? (
          <p>Loading…</p>
        ) : outfit === null ? (
          <p>No outfit matches these conditions.</p>
        ) : (
          <div className={loading ? "opacity-50" : ""}>
            <OutfitCard outfit={outfit} />
          </div>
        )}
      </div>
    </section>
  );
}
