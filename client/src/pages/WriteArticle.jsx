import { useEffect, useState } from "react";
import { createArticle, getArticleBySlug, getCategories, updateArticle } from "../api/articles.js";

export default function WriteArticle({ article, onBack, onPublished }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", summary: "", content: "", category: "", type: "news", tags: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("กำลังโหลดหมวดหมู่…");
  const [submitting, setSubmitting] = useState(false);
  const inputClass = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20";

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setForm((current) => ({ ...current, category: article?.categoryId || data[0]?._id || "" }));
      setMessage(data.length ? "" : "ยังไม่มีหมวดหมู่ — รัน npm run seed ที่ server ก่อน");
    }).catch((error) => setMessage(error.message));
    if (article?.slug) {
      getArticleBySlug(article.slug).then((data) => {
        setForm({ title: data.title, summary: data.summary, content: data.content, category: data.category?._id || "", type: data.type, tags: data.tags?.join(", ") || "" });
        setImagePreview(data.coverImage || "");
      }).catch((error) => setMessage(error.message));
    }
  }, [article]);
  async function handleSubmit(event) {
    event.preventDefault(); setSubmitting(true); setMessage("");
    try { const savedArticle = await (article ? updateArticle(article.id, { ...form, coverImage: imageFile }) : createArticle({ ...form, coverImage: imageFile })); onPublished(savedArticle); }
    catch (error) { setMessage(error.message); } finally { setSubmitting(false); }
  }
  const handleImageChange = (event) => { const file = event.target.files?.[0]; setImageFile(file || null); setImagePreview(file ? URL.createObjectURL(file) : ""); };
  return <main className="min-h-screen bg-[#090914] px-5 py-10 text-slate-100"><div className="mx-auto max-w-3xl"><button type="button" onClick={onBack} className="text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200">← กลับหน้าหลัก</button><header className="mt-6"><p className="text-sm font-bold tracking-[.2em] text-fuchsia-300">NEWSKAO STUDIO</p><h1 className="mt-2 text-4xl font-black">{article ? "แก้ไขข่าว" : "เขียนข่าวใหม่"}</h1><p className="mt-2 text-slate-400">เผยแพร่ข่าวเกมและอุปกรณ์คอมสู่หน้าแรก</p></header><form className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8" onSubmit={handleSubmit}><label className="block text-sm font-medium text-slate-300">หัวข้อข่าว<input className={inputClass} required maxLength="200" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label className="block text-sm font-medium text-slate-300">รูปปกข่าว <span className="text-slate-500">(JPG, PNG, WEBP ไม่เกิน 5 MB)</span><input className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-fuchsia-500 file:px-3 file:py-1 file:font-semibold file:text-white`} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />{imagePreview && <img className="mt-3 h-52 w-full rounded-xl object-cover" src={imagePreview} alt="ตัวอย่างรูปปกข่าว" />}</label><label className="block text-sm font-medium text-slate-300">สรุปข่าว<textarea className={inputClass} required maxLength="500" rows="3" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-300">หมวดหมู่<select className={inputClass} required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-300">ประเภท<select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="news">ข่าว</option><option value="review">รีวิว</option><option value="guide">ไกด์</option><option value="announcement">ประกาศ</option></select></label></div><label className="block text-sm font-medium text-slate-300">แท็ก (คั่นด้วย ,)<input className={inputClass} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="gpu, pc gaming" /></label><label className="block text-sm font-medium text-slate-300">เนื้อหาข่าว<textarea className={inputClass} required rows="8" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></label>{message && <p className="rounded-xl bg-rose-400/10 p-3 text-sm text-rose-200" role="alert">{message}</p>}<button className="w-full rounded-xl bg-fuchsia-500 px-4 py-3 font-bold hover:bg-fuchsia-400 disabled:opacity-60" disabled={submitting || !categories.length} type="submit">{submitting ? "กำลังบันทึก…" : article ? "บันทึกการแก้ไข" : "เผยแพร่ข่าว"}</button></form></div></main>;
}
