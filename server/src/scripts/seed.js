require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user.model");
const Category = require("../models/category.model");

const seed = async () => {
    if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD) {
        throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running the seed script");
    }
    await connectDB();
    const password = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
    const author = await User.findOneAndUpdate(
        { email: process.env.SEED_ADMIN_EMAIL.toLowerCase() },
        { name: "NewsKao Editor", email: process.env.SEED_ADMIN_EMAIL.toLowerCase(), password, role: "editor" },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    const categoryValues = [
        { name: "ข่าว", slug: "news" }, { name: "รีวิว", slug: "reviews" },
        { name: "ไกด์", slug: "guides" }, { name: "eSports", slug: "esports" }, { name: "อุปกรณ์คอม", slug: "hardware" },
    ];
    categoryValues.push({ name: "ข่าวเกม", slug: "game-news" });

    const categories = {};
    for (const value of categoryValues) categories[value.slug] = await Category.findOneAndUpdate({ slug: value.slug }, value, { upsert: true, returnDocument: "after" });
    console.log("Seeded admin and categories; no articles were created");
    await mongoose.disconnect();
};

seed().catch(async (error) => { console.error(error.message); await mongoose.disconnect(); process.exit(1); });
