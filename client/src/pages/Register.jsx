import { useState } from "react";
import { register } from "../api/auth.js";

export default function Register({ onBack, onAuthenticated, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return setMessage("รหัสผ่านยืนยันไม่ตรงกัน");
    setSubmitting(true); setMessage("");
    try {
      const result = await register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem("gamepulse_token", result.token);
      onAuthenticated(result.user);
    } catch (error) { setMessage(error.message); } finally { setSubmitting(false); }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20";
  return <main className="grid min-h-screen place-items-center bg-[#090914] px-5 py-10 text-slate-100"><section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-fuchsia-950/30"><div className="bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-700 px-8 py-10"><button type="button" onClick={onBack} className="text-sm font-semibold text-white/80 hover:text-white">← กลับหน้าหลัก</button><p className="mt-8 text-sm font-bold tracking-[.2em] text-white/75">NEWSKAO</p><h1 className="mt-2 text-3xl font-black">สร้างบัญชีใหม่</h1><p className="mt-2 text-sm text-white/80">เริ่มติดตามทุกเรื่องเกมที่คุณสนใจ</p></div><form className="space-y-4 p-8" onSubmit={handleSubmit}><label className="block text-sm font-medium text-slate-300">ชื่อที่แสดง<input className={inputClass} required maxLength="100" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label className="block text-sm font-medium text-slate-300">อีเมล<input className={inputClass} type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label className="block text-sm font-medium text-slate-300">รหัสผ่าน<input className={inputClass} type="password" autoComplete="new-password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><label className="block text-sm font-medium text-slate-300">ยืนยันรหัสผ่าน<input className={inputClass} type="password" autoComplete="new-password" minLength="6" required value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></label><button className="w-full rounded-xl bg-fuchsia-500 px-4 py-3 font-bold hover:bg-fuchsia-400 disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "กำลังสร้างบัญชี…" : "สมัครสมาชิก"}</button>{message && <p className="rounded-lg bg-rose-400/10 p-3 text-center text-sm text-rose-200" role="alert">{message}</p>}<p className="text-center text-sm text-slate-400">มีบัญชีแล้ว? <button type="button" onClick={onLogin} className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">เข้าสู่ระบบ</button></p></form></section></main>;
}
