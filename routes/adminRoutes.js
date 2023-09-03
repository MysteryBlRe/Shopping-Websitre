const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

router.get('/admin', authController.requireAdmin, adminController.adminDashboard);
router.get('/admin/*', authController.requireAdmin);
router.get('/admin/product', adminController.adminProductPage)
router.get('/admin/category', adminController.adminCategoryPage)

router.post('/admin/product', adminController.submitProduct);
router.post('/admin/category', adminController.submitCategory);

module.exports = router;
