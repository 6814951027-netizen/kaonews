const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
        if (!token || !process.env.JWT_SECRET) {
            return res.status(401).json({ message: "Authentication is required" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};

module.exports = { requireAuth };
