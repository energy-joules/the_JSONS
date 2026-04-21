import { apiFetch } from "../auth/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

export async function createEvent(payload) {
  const data = await apiFetch("/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.event;
}

export async function getMyEvents() {
  const data = await apiFetch("/events/mine");
  return data.events ?? [];
}

export async function recordCompletion(payload) {
  const data = await apiFetch("/participations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.participation;
}

export async function getMyParticipations() {
  const data = await apiFetch("/participations/mine");
  return data.participations ?? [];
}
