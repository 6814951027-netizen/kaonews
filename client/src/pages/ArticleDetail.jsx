import { useEffect, useState } from "react";
import { getArticleBySlug } from "../api/articles.js";

export default function ArticleDetail({ article, canEdit, onBack, onEdit }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setDetail(null);
    setError("");
    getArticleBySlug(article.slug).then(setDetail).catch((requestError) => setError(requestError.message));
  }, [article.slug]);

  if (error) {
    return <main className="min-h-screen bg-[#090914] px-5 py-10 text-slate-100"><div className="mx-auto max-w-3xl"><button type="button" onClick={onBack} className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">← กลับหน้าหลัก</button><p className="mt-10 rounded-xl border border-rose-400/30 bg-rose-400/10 p-5 text-rose-200">{error}</p></div></main>;
  }

  if (!detail) {
    return <main className="min-h-screen bg-[#090914] px-5 py-10 text-slate-100"><div className="mx-auto max-w-3xl"><button type="button" onClick={onBack} className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">← กลับหน้าหลัก</button><p className="mt-10 text-center text-slate-400">กำลังโหลดข่าว…</p></div></main>;
  }

  return <main className="min-h-screen bg-[#090914] px-5 py-10 text-slate-100"><article className="mx-auto max-w-4xl"><div className="flex items-center justify-between gap-4"><button type="button" onClick={onBack} className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">← กลับหน้าหลัก</button>{canEdit && <button type="button" onClick={() => onEdit(detail)} className="rounded-lg border border-fuchsia-400/50 px-3 py-2 text-sm font-bold text-fuchsia-200 hover:bg-fuchsia-400/10">แก้ไขข่าว</button>}</div>{detail.coverImage ? <img className="mt-6 h-64 w-full rounded-3xl object-cover sm:h-96" src={detail.coverImage} alt="" /> : <div className="mt-6 flex h-64 items-end rounded-3xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-8 sm:h-96"><span className="text-6xl">🎮</span></div>}<header className="mt-8"><p className="text-sm font-bold uppercase tracking-widest text-fuchsia-300">{detail.category?.name || detail.type} · {detail.publishedAt ? new Date(detail.publishedAt).toLocaleDateString("th-TH") : "ล่าสุด"}</p><h1 className="mt-3 text-3xl font-black leading-tight text-white sm:text-5xl">{detail.title}</h1><p className="mt-5 text-lg leading-8 text-slate-300">{detail.summary}</p><p className="mt-4 text-sm text-slate-500">โดย {detail.author?.name || "NewsKao"} · {detail.views ?? 0} views</p></header><div className="mt-10 whitespace-pre-wrap border-t border-white/10 pt-8 text-base leading-8 text-slate-200">{detail.content}</div>{detail.tags?.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{detail.tags.map((tag) => <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300" key={tag}>#{tag}</span>)}</div>}</article></main>;
}
