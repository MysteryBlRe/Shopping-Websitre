const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get('/admin', authController.requireAdmin, adminController.adminDashboard);
router.get('/admin/*', authController.requireAdmin);
router.get('/admin/product', adminController.adminProductPage)
router.get('/admin/category', adminController.adminCategoryPage)
router.get('/admin/subcategory', adminController.adminSubCategoryPage)

router.post('/admin/product',authController.requireAdmin ,adminController.submitProduct);
router.post('/admin/category',authController.requireAdmin, adminController.submitCategory);
router.post('/admin/subcategory',authController.requireAdmin, adminController.submitSubCategory);


module.exports = router;
