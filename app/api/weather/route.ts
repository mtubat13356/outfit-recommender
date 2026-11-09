import type { NextRequest } from "next/server";

// GET /api/weather?city=London → { city, country, temperature } (whole °C)
// Uses Open-Meteo (free, no API key): first find the city's coordinates,
// then ask for the current temperature there.
export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");
  if (city === null || city.trim() === "") {
    return Response.json({ error: "city is required" }, { status: 400 });
  }

  try {
    // Step 1: city name → coordinates. URLSearchParams safely encodes spaces etc.
    const geoParams = new URLSearchParams({ name: city.trim(), count: "1" });
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${geoParams}`, {
      signal: AbortSignal.timeout(5000), // give up after 5 seconds
    });
    if (!geoRes.ok) {
      return Response.json({ error: "Weather service unavailable" }, { status: 502 });
    }
    const geo = await geoRes.json();

    // Written by the user: no "results" key, or an empty list → not found
    if (!Array.isArray(geo.results) || geo.results.length === 0) {
      return Response.json({ error: "City not found" }, { status: 404 });
    }
    const place = geo.results[0];

    // Step 2: coordinates → current temperature
    const weatherParams = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: "temperature_2m",
    });
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!weatherRes.ok) {
      return Response.json({ error: "Weather service unavailable" }, { status: 502 });
    }
    const weather = await weatherRes.json();

    // Written by the user
    const temperature = Math.round(weather.current.temperature_2m);

    return Response.json({ city: place.name, country: place.country, temperature });
  } catch {
    // Network failure or timeout
    return Response.json({ error: "Weather service unavailable" }, { status: 502 });
  }
}
