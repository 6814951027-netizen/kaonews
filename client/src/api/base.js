const configuredApiUrl = import.meta.env.VITE_API_URL || window.PORTABLE_TRACKS_API_URL;

// Use Vite's development proxy locally and the deployed API in production.
export const API_BASE_URL = configuredApiUrl ? configuredApiUrl.replace(/\/$/, "") : "/api";
