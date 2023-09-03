const Category = require('../models/Category');
const Product = require('../models/Product');

const categoriesPage = async (req, res) => {
    const categories = await Category.find({});
    res.render('categories', {categories});
}

const categoryPage = async (req, res) => {
    let categoryId = req.params.id;

    const products = await Product.find({category : categoryId});

    res.render('category', {categoryId, products});
}

module.exports = {
    categoriesPage,
    categoryPage
}