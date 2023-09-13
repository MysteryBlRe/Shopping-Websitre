const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');

const adminDashboard = (req, res) => {
    res.render('admin');
}

const adminProductPage = async (req, res) => {
    const subCategories = await SubCategory.find();

    res.render('productsubmit', {subCategories})
}

const adminSubCategoryPage = async (req, res) => {
    const categories = await Category.find();

    res.render('subCategorySubmit', {categories})
}

const adminCategoryPage = async (req, res) => {
    res.render('categorySubmit')
}

const submitProduct = async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const image = req.body.image;
    const description = req.body.description;

    try {
        await Product.create({name, category, image, description});
        res.status(200).json({image});
    } catch (err) {
        console.log(err);
        res.status(400);
    }
}

const submitSubCategory = async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const image = req.body.image;

    try {
        await SubCategory.create({name, category, image});
        res.status(200).json({image});
    } catch (err) {
        console.log(err);
        res.status(400);
    }
}


const submitCategory = async (req, res) => {
    const name = req.body.name;
    const image = req.body.image;

    try {
        await Category.create({name, image});
        res.status(200).json({image});
    } catch (err) {
        console.log(err);
        res.status(400);
    }
}

module.exports = {
    adminDashboard,
    adminProductPage,
    adminCategoryPage,
    adminSubCategoryPage,
    submitProduct,
    submitCategory,
    submitSubCategory
}