const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const categoriesController = require('../controllers/categoriesController');

router.get('/categories' , categoriesController.categoriesPage);
router.get('/subcategory/:id' , categoriesController.subCategoryPage);

router.get('/category/:id', categoriesController.categoryPage);

router.get('/product/:id', authController.requireAuth, categoriesController.productPage);

router.post('/product/order', authController.requireAuth, categoriesController.orderProduct);

module.exports = router;