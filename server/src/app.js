const express = require("express");
const path = require("path");
const cors = require("cors");
const trackRoutes = require("./routes/track.routes");
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const categoryRoutes = require("./routes/category.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const connectDB = require("./config/db");

const app = express();

// 1. Global middleware
app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 2. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/tracks", trackRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);

// 3. Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;
