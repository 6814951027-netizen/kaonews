const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        logo: { type: String, default: null },
        website: { type: String, trim: true, default: null },
        description: { type: String, trim: true, maxlength: 500 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
