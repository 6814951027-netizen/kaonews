// Vite proxies /api to the backend (http://localhost:5000) during development.
// Set PORTABLE_TRACKS_API_URL only when deploying with a different API address.
const API_BASE_URL = window.PORTABLE_TRACKS_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.message || "ไม่สามารถเชื่อมต่อกับ API ได้");
  }
  return body;
}

export const getTracks = () => request("/tracks");

export const createTrack = (track) =>
  request("/tracks", { method: "POST", body: JSON.stringify(track) });

export const downloadTrack = (id) =>
  request(`/tracks/${encodeURIComponent(id)}/download`, { method: "POST" });
