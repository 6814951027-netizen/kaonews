const express = require("express");
const { getArticles, getArticleBySlug, createArticle, updateArticle } = require("../controllers/article.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getArticles);
router.post("/", requireAuth, uploadImage.single("coverImage"), createArticle);
router.put("/:id", requireAuth, uploadImage.single("coverImage"), updateArticle);
router.get("/:slug", getArticleBySlug);

module.exports = router;
