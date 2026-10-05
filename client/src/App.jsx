import { useEffect, useMemo, useState } from "react";
import { articles as demoArticles, categories } from "./data/articles.js";
import { getArticles } from "./api/articles.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import WriteArticle from "./pages/WriteArticle.jsx";

const toCardArticle = (article) => ({
  id: article._id,
  slug: article.slug,
  category: article.category?.name || article.type,
  categoryId: article.category?._id,
  authorId: article.author?._id,
  author: article.author?.name || "NewsKao Editor",
  title: article.title,
  excerpt: article.summary,
  time: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("th-TH") : "ล่าสุด",
  views: article.views ?? 0,
  coverImage: article.coverImage,
  accent: "from-indigo-700 via-blue-700 to-fuchsia-800",
  badge: article.type?.toUpperCase(),
});

function Cover({ article, className = "" }) {
  return <div className={`cover ${className}`}>
    {article.coverImage ? <img src={article.coverImage} alt="" /> : <div className={`cover-fallback bg-gradient-to-br ${article.accent}`}><span>🎮</span></div>}
    <div className="cover-shade" />
    <span className="cover-badge">{article.badge || article.category}</span>
  </div>;
}

function ArticleCard({ article, onOpen, onEdit, compact = false }) {
  return <article className={`news-card ${compact ? "news-card-compact" : ""}`} onClick={() => onOpen?.(article)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen?.(article); } }} role="button" tabIndex={0}>
    <Cover article={article} />
    <div className="news-card-body"><p className="eyebrow">{article.category} <span>·</span> {article.time}</p><h3>{article.title}</h3><p className="news-excerpt">{article.excerpt}</p><div className="news-meta"><span>BY {article.author.toUpperCase()}</span><span>{article.views} VIEWS</span>{onEdit && <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(article); }}>แก้ไข</button>}</div></div>
  </article>;
}

function Ranking({ articles, onOpen }) {
  return <aside className="ranking-panel"><p className="section-kicker">MOST READ</p><h2>กำลังมาแรง</h2>{articles.slice(0, 4).map((article, index) => <button type="button" className="ranking-row" key={article.id} onClick={() => onOpen(article)}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{article.title}</span></button>)}</aside>;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [articles, setArticles] = useState(demoArticles);
  const [editingArticle, setEditingArticle] = useState(null);
  const [viewingArticle, setViewingArticle] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => { getArticles().then((data) => setArticles(data.map(toCardArticle))).catch(() => setArticles([])); }, []);

  const filteredArticles = useMemo(() => articles.filter((article) => (activeCategory === "ทั้งหมด" || article.category === activeCategory) && `${article.title} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase())), [articles, activeCategory, query]);
  const openArticle = (article) => { setViewingArticle(article); setPage("detail"); };
  const canEditArticle = (article) => user && (user.role === "editor" || user.role === "admin" || String(user.id) === String(article.authorId));
  const handleSaved = (savedArticle) => { const cardArticle = toCardArticle(savedArticle); setArticles((current) => editingArticle ? current.map((item) => item.id === cardArticle.id ? cardArticle : item) : [cardArticle, ...current]); setEditingArticle(null); setPage("home"); };
  const setCategory = (category) => setActiveCategory(category);

  if (page === "login") return <Login onBack={() => setPage("home")} onRegister={() => setPage("register")} onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setPage("home"); }} />;
  if (page === "register") return <Register onBack={() => setPage("home")} onLogin={() => setPage("login")} onAuthenticated={(authenticatedUser) => { setUser(authenticatedUser); setPage("home"); }} />;
  if (page === "write") return <WriteArticle article={editingArticle} onBack={() => { setEditingArticle(null); setPage("home"); }} onPublished={handleSaved} />;
  if (page === "detail" && viewingArticle) return <ArticleDetail article={viewingArticle} canEdit={canEditArticle(viewingArticle)} onBack={() => { setViewingArticle(null); setPage("home"); }} onEdit={(article) => { setViewingArticle(null); setEditingArticle({ ...viewingArticle, ...article, id: viewingArticle.id }); setPage("write"); }} />;

  const hero = filteredArticles[0];
  const secondary = filteredArticles.slice(1, 3);
  const otherStories = filteredArticles.slice(3);

  return <main className="site-shell"><header className="site-header"><div className="header-inner"><button className="brand" type="button" onClick={() => { setCategory("ทั้งหมด"); setQuery(""); }}>NEWS<span>KAO</span><small>GAME CULTURE</small></button><nav className="main-nav"><button type="button" onClick={() => setCategory("ทั้งหมด")}>หน้าแรก</button><button type="button" onClick={() => { setCategory("ทั้งหมด"); setQuery(""); }}>ข่าวทั้งหมด</button><button type="button" onClick={() => setCategory("ข่าว")}>ข่าว</button><button type="button" onClick={() => setCategory("รีวิว")}>รีวิว</button><button type="button" onClick={() => setCategory("ไกด์")}>ไกด์</button><button type="button" onClick={() => setCategory("eSports")}>eSports</button></nav><div className="header-actions"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาข่าว..." /></label>{user && <button className="action-button" type="button" onClick={() => setPage("write")}>+ เขียนข่าว</button>}<button className="login-button" type="button" onClick={() => !user && setPage("login")}>{user ? user.name : "เข้าสู่ระบบ"}</button></div></div></header>
    <div className="page-wrap"><section className="intro-row"><div><p className="section-kicker">NEWSKAO DAILY</p><h1>เรื่องราวเกมที่<br /><em>อยากให้คุณอ่าน</em></h1></div><p className="intro-copy">ข่าวเกม รีวิว ไกด์ และวัฒนธรรมเกม<br />คัดสรรมาให้คุณทุกวัน</p></section>
      {hero ? <section className="hero-layout"><article className="hero-story" onClick={() => openArticle(hero)}><Cover article={hero} className="hero-cover" /><div className="hero-copy"><p className="eyebrow">{hero.category} <span>·</span> {hero.time}</p><h2>{hero.title}</h2><p>{hero.excerpt}</p><span className="read-link">อ่านเรื่องนี้ <b>↗</b></span></div></article><div className="side-stories">{secondary.map((article) => <ArticleCard key={article.id} article={article} compact onOpen={openArticle} onEdit={canEditArticle(article) ? (item) => { setEditingArticle(item); setPage("write"); } : null} />)}</div></section> : <div className="empty-state">ยังไม่มีข่าวในหมวดนี้</div>}
      {filteredArticles.length > 0 && <div className="trending-bar"><strong>TRENDING</strong>{filteredArticles.slice(0, 5).map((article) => <button key={article.id} type="button" onClick={() => openArticle(article)}>{article.title}</button>)}</div>}
      <section className="content-grid"><div className="feed-column"><div className="section-heading"><div><p className="section-kicker">LATEST STORIES</p><h2>ข่าวล่าสุด</h2></div><span>{filteredArticles.length} บทความ</span></div><div className="feed-list">{filteredArticles.slice(0, 5).map((article) => <ArticleCard key={article.id} article={article} onOpen={openArticle} onEdit={canEditArticle(article) ? (item) => { setEditingArticle(item); setPage("write"); } : null} />)}</div></div><div className="sidebar"><Ranking articles={filteredArticles} onOpen={openArticle} /><div className="ad-panel"><span>NEWSKAO</span><strong>GAME<br />CULTURE</strong><small>อ่านเรื่องที่คุณสนใจ</small></div></div></section>
      {otherStories.length > 0 && <section className="category-section"><div className="section-heading"><div><p className="section-kicker">MORE TO EXPLORE</p><h2>เรื่องที่น่าสนใจ</h2></div></div><div className="story-grid">{otherStories.map((article) => <ArticleCard key={article.id} article={article} onOpen={openArticle} />)}</div></section>}
    </div><footer className="site-footer"><strong>NEWS<span>KAO</span></strong><span>ข่าวเกมและอุปกรณ์คอมสำหรับคนที่รักการเล่น</span></footer>
  </main>;
}
