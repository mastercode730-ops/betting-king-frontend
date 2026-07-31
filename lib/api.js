// lib/api.js — Fetch helpers for all API calls
// All calls go through Next.js proxy → Express backend on :3001

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function fetchTodayResults(date = '') {
  const q = date ? `?date=${date}` : '';
  const res = await fetch(`${API_BASE}/api/results/today${q}`, {
    next: { revalidate: 30 }, // ISR: revalidate every 30s
  });
  if (!res.ok) throw new Error('Failed to fetch today results');
  return res.json();
}

export async function fetchMonthlyChart(month, year) {
  const res = await fetch(`${API_BASE}/api/chart/monthly?month=${month}&year=${year}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch monthly chart');
  return res.json();
}

export async function fetchGameChart(code, year) {
  const res = await fetch(`${API_BASE}/api/chart/game/${code}?year=${year}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch game chart');
  return res.json();
}

export async function fetchAllGameSlugs() {
  const res = await fetch(`${API_BASE}/api/games/slugs`, {
    next: { revalidate: 86400 }, // Cache 24h — games rarely change
  });
  if (!res.ok) throw new Error('Failed to fetch game slugs');
  return res.json();
}
