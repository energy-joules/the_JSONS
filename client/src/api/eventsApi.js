const API_BASE = "http://localhost:9000";

export async function getEvents(limit = 50) {
  const res = await fetch(`${API_BASE}/events?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch events (${res.status})`);
  return res.json();
}

export async function searchEventsApi(q, limit = 50) {
  const res = await fetch(
    `${API_BASE}/events/search?q=${encodeURIComponent(q)}&limit=${limit}`
  );
  if (!res.ok) throw new Error(`Failed to search events (${res.status})`);
  const data = await res.json();
  return data.results ?? [];
}
