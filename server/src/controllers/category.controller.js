const Category = require("../models/category.model");

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
            .select("name slug description image")
            .sort({ name: 1 })
            .lean();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

module.exports = { getCategories };
