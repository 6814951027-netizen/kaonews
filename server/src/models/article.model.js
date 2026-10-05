const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        summary: { type: String, required: true, trim: true, maxlength: 500 },
        content: { type: String, required: true },
        coverImage: { type: String, default: null },
        type: {
            type: String,
            enum: ["news", "review", "guide", "announcement"],
            default: "news",
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        tags: [{ type: String, trim: true, lowercase: true }],
        views: { type: Number, default: 0, min: 0 },
        publishedAt: { type: Date, default: null },
        seoTitle: { type: String, trim: true, maxlength: 70 },
        seoDescription: { type: String, trim: true, maxlength: 160 },
    },
    { timestamps: true }
);

articleSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, publishedAt: -1 });

module.exports = mongoose.model("Article", articleSchema);
