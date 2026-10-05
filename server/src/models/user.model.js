const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true, select: false },
    profile: { type: String, default: null },
    role: {
        type: String,
        enum: ["user", "writer", "editor", "admin"],
        default: "user",
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
