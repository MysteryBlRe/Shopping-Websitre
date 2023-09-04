const Category = require('../models/Category');
const Product = require('../models/Product');

const categoriesPage = async (req, res) => {
    const categories = await Category.find({});
    res.render('categories', {categories});
}

const categoryPage = async (req, res) => {
    let categoryId = req.params.id;

    const categories = await Category.find({name: categoryId});
    if(categories == ''){
        return res.redirect('/categories');
    }

    const products = await Product.find({category : categoryId});

    res.render('category', {categoryId, products});
}

const productPage = async (req, res) => {
    let productId = req.params.id;

    const product = await Product.findOne({name: productId});

    if(product == ''){
        return res.redirect('/categories');
    }

    res.render('product', {product});
}

module.exports = {
    categoriesPage,
    categoryPage,
    productPage
}