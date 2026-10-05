import { API_BASE_URL } from "./base.js";

export async function getArticles(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
  const response = await fetch(`${API_BASE_URL}/articles${query.size ? `?${query}` : ""}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "ไม่สามารถโหลดข่าวได้");
  return data;
}

export async function getArticleBySlug(slug) {
  const response = await fetch(`${API_BASE_URL}/articles/${slug}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "ไม่สามารถโหลดข่าวได้");
  return data;
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "ไม่สามารถโหลดหมวดหมู่ได้");
  return data;
}

export async function createArticle(article) {
  return saveArticle("/articles", "POST", article, "ไม่สามารถเผยแพร่ข่าวได้");
}

export async function updateArticle(id, article) {
  return saveArticle(`/articles/${id}`, "PUT", article, "ไม่สามารถแก้ไขข่าวได้");
}

async function saveArticle(path, method, article, fallbackMessage) {
  const token = localStorage.getItem("gamepulse_token");
  const formData = new FormData();
  Object.entries(article).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") formData.append(key, value);
  });
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || fallbackMessage);
  return data;
}
