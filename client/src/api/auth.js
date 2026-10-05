import { API_BASE_URL } from "./base.js";

async function request(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "ไม่สามารถดำเนินการได้");
  return data;
}

export const register = (user) => request("/auth/register", user);
export const login = (credentials) => request("/auth/login", credentials);
