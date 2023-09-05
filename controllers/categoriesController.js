const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');

const categoriesPage = async (req, res) => {
    const categories = await Category.find({});
    res.render('categories', {categories});
}

const subCategoryPage = async (req, res) => {
    let subcategoryId = req.params.id;

    const products = await Product.find({category: subcategoryId});
    res.render('subCategory', {subcategoryId, products});
}

const categoryPage = async (req, res) => {
    let categoryId = req.params.id;

    const subCategories = await SubCategory.find({category: categoryId});

    res.render('category', {categoryId, subCategories});
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
    productPage,
    subCategoryPage
}