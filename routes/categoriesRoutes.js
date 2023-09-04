const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const categoriesController = require('../controllers/categoriesController');

router.get('/categories', authController.requireAuth , categoriesController.categoriesPage);
router.get('/categories/*', authController.requireAuth);
router.get('/category/:id', categoriesController.categoryPage);

router.get('/product/:id', authController.requireAuth, categoriesController.productPage);

module.exports = router;