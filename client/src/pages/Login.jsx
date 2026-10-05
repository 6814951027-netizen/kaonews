import { useState } from "react";
import { login } from "../api/auth.js";

export default function Login({ onBack, onAuthenticated, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const result = await login({ email, password });
      localStorage.setItem("gamepulse_token", result.token);
      onAuthenticated(result.user);
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-[#090914] px-5 py-10 text-slate-100"><section className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-fuchsia-950/30"><div className="bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 px-8 py-10"><button type="button" onClick={onBack} className="text-sm font-semibold text-white/80 hover:text-white">← กลับหน้าหลัก</button><p className="mt-8 text-sm font-bold tracking-[.2em] text-white/75">NEWSKAO</p><h1 className="mt-2 text-3xl font-black">ยินดีต้อนรับกลับมา</h1><p className="mt-2 text-sm text-white/80">เข้าสู่ระบบเพื่อติดตามข่าวเกมที่คุณสนใจ</p></div><form className="space-y-5 p-8" onSubmit={handleSubmit}><label className="block text-sm font-medium text-slate-300">อีเมล<input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label className="block text-sm font-medium text-slate-300">รหัสผ่าน<input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20" type="password" autoComplete="current-password" required minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" /></label><div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 text-slate-400"><input type="checkbox" className="accent-fuchsia-500" /> จดจำฉัน</label><button type="button" className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">ลืมรหัสผ่าน?</button></div><button className="w-full rounded-xl bg-fuchsia-500 px-4 py-3 font-bold hover:bg-fuchsia-400 disabled:opacity-60" disabled={submitting} type="submit">{submitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}</button>{message && <p className={`rounded-lg p-3 text-center text-sm ${isError ? "bg-rose-400/10 text-rose-200" : "bg-emerald-400/10 text-emerald-200"}`} role="status">{message}</p>}<p className="text-center text-sm text-slate-400">ยังไม่มีบัญชี? <button type="button" onClick={onRegister} className="font-semibold text-fuchsia-300 hover:text-fuchsia-200">สมัครสมาชิก</button></p></form></section></main>;
}
