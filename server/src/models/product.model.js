const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        type: {
            type: String,
            required: true,
            enum: ["cpu", "gpu", "laptop", "motherboard", "ram", "storage", "monitor", "peripheral", "other"],
        },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
        model: { type: String, trim: true },
        images: [{ type: String, trim: true }],
        // Map รองรับสเปกที่แตกต่างกันของ CPU, GPU, laptop และอุปกรณ์อื่น ๆ
        specifications: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
        releaseDate: Date,
        price: { type: Number, min: 0 },
        currency: { type: String, default: "THB", uppercase: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

productSchema.index({ type: 1, brand: 1 });

module.exports = mongoose.model("Product", productSchema);
