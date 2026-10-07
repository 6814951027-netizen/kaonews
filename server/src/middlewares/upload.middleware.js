const multer = require("multer");

const uploadImage = multer({
    // Vercel's deployment filesystem is read-only. Keep the image in memory
    // here; the article controller stores it in Vercel Blob instead.
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return callback(null, true);
        callback(new Error("Only image files are allowed"));
    },
});

module.exports = { uploadImage };
