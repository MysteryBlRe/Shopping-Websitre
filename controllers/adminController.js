const Category = require('../models/Category');
const Product = require('../models/Product');

const adminDashboard = (req, res) => {
    res.render('admin');
}

const adminProductPage = async (req, res) => {
    const categories = await Category.find();

    res.render('productsubmit', {categories})
}

const submitProduct = async (req, res) => {
    const name = req.body.name;
    const category = req.body.category;
    const image = req.body.image;

    try {
        await Product.create({name, category, image});
        res.status(200).json({image});
    } catch (err) {
        console.log(err);
        res.status(400);
    }
}

module.exports = {
    adminDashboard,
    adminProductPage,
    submitProduct
}