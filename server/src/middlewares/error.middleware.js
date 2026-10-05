const notFound = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
}

if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid id: ${err.value}` });
}

if (err.name === "MulterError" || err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
}

    res.status(500).json({ message: err.message || "Server error" });
};

module.exports = { notFound, errorHandler };
