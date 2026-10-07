const Article = require("../models/article.model");
const Category = require("../models/category.model");
const { put } = require("@vercel/blob");
const crypto = require("crypto");
const path = require("path");

const uploadCoverImage = async (file) => {
    if (!file) return null;
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
    }

    const extension = path.extname(file.originalname).toLowerCase() || ".img";
    const blob = await put(`article-covers/${crypto.randomUUID()}${extension}`, file.buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.mimetype,
    });
    return blob.url;
};

const getArticles = async (req, res, next) => {
    try {
        const { search, type, limit = 20 } = req.query;
        const query = { status: "published" };

        if (type && ["news", "review", "guide", "announcement"].includes(type)) {
            query.type = type;
        }
        if (search?.trim()) {
            query.$text = { $search: search.trim() };
        }

        const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
        const articles = await Article.find(query)
            .select("title slug summary coverImage type tags views publishedAt createdAt")
            .populate("category", "name slug")
            .populate("author", "name profile")
            .sort(search ? { score: { $meta: "textScore" }, publishedAt: -1 } : { publishedAt: -1 })
            .limit(parsedLimit)
            .lean();

        res.json(articles);
    } catch (error) {
        next(error);
    }
};

const getArticleBySlug = async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug, status: "published" })
            .populate("category", "name slug")
            .populate("author", "name profile")
            .lean();
        if (!article) return res.status(404).json({ message: "Article not found" });
        res.json(article);
    } catch (error) {
        next(error);
    }
};

const createArticle = async (req, res, next) => {
    try {
        const { title, summary, content, category, type = "news", tags = [] } = req.body;
        if (!title || !summary || !content || !category) {
            return res.status(400).json({ message: "Title, summary, content and category are required" });
        }
        const selectedCategory = await Category.findById(category);
        if (!selectedCategory) return res.status(400).json({ message: "Invalid category" });
        const slugBase = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const coverImage = await uploadCoverImage(req.file);
        const article = await Article.create({
            title,
            slug: `${slugBase || "article"}-${Date.now()}`,
            summary,
            content,
            coverImage,
            type,
            tags: Array.isArray(tags) ? tags : String(tags).split(",").map((tag) => tag.trim()).filter(Boolean),
            author: req.user._id,
            category: selectedCategory._id,
            status: "published",
            publishedAt: new Date(),
        });
        const populatedArticle = await article.populate(["category", "author"]);
        res.status(201).json(populatedArticle);
    } catch (error) {
        next(error);
    }
};

const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.status(404).json({ message: "Article not found" });

        const canEdit = article.author.toString() === req.user._id.toString() || ["editor", "admin"].includes(req.user.role);
        if (!canEdit) return res.status(403).json({ message: "You do not have permission to edit this article" });

        const { title, summary, content, category, type, tags } = req.body;
        if (!title || !summary || !content || !category) {
            return res.status(400).json({ message: "Title, summary, content and category are required" });
        }
        const selectedCategory = await Category.findById(category);
        if (!selectedCategory) return res.status(400).json({ message: "Invalid category" });

        article.title = title;
        article.summary = summary;
        article.content = content;
        article.category = selectedCategory._id;
        article.type = type || article.type;
        article.tags = Array.isArray(tags) ? tags : String(tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
        if (req.file) article.coverImage = await uploadCoverImage(req.file);

        await article.save();
        const populatedArticle = await article.populate(["category", "author"]);
        res.json(populatedArticle);
    } catch (error) {
        next(error);
    }
};

module.exports = { getArticles, getArticleBySlug, createArticle, updateArticle };
