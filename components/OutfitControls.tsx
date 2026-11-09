"use client";

import { useEffect, useState } from "react";
import type { Outfit } from "@/lib/recommendOutfit";
import OutfitCard from "@/components/OutfitCard";

const OCCASIONS = ["casual", "school", "work", "formal", "sport"];

export default function OutfitControls() {
  const [occasion, setOccasion] = useState("casual");
  const [temperature, setTemperature] = useState(20);

  // Weather lookup: the city box, plus a status line shown under it
  const [city, setCity] = useState("");
  const [weatherStatus, setWeatherStatus] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  async function handleWeatherSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page on submit
    if (city.trim() === "") return;

    setWeatherLoading(true);
    setWeatherStatus(null);
    try {
      const res = await fetch(`/api/weather?${new URLSearchParams({ city })}`);
      const data = await res.json();
      if (!res.ok) {
        setWeatherStatus(data.error ?? "Couldn't get the weather.");
        return;
      }
      // Keep it inside the slider's range (-10..40)
      setTemperature(Math.min(40, Math.max(-10, data.temperature)));
      setWeatherStatus(`Now in ${data.city}, ${data.country}: ${data.temperature}°C`);
    } catch {
      setWeatherStatus("Couldn't reach the server.");
    } finally {
      setWeatherLoading(false);
    }
  }

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

      <form onSubmit={handleWeatherSubmit} className="mt-6">
        <span className="text-sm font-medium">City</span>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="e.g. London"
            className="block w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
          <button
            type="submit"
            disabled={weatherLoading || city.trim() === ""}
            className="shrink-0 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {weatherLoading ? "Checking…" : "Use current weather"}
          </button>
        </div>
        {weatherStatus !== null && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{weatherStatus}</p>
        )}
      </form>

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
