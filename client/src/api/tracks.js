import { API_BASE_URL } from "./base.js";

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
