const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
        content: { type: String, required: true, trim: true, maxlength: 2000 },
        status: {
            type: String,
            enum: ["visible", "hidden", "deleted"],
            default: "visible",
        },
    },
    { timestamps: true }
);

commentSchema.index({ article: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
